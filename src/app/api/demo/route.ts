import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/groq";

const DEMO_SYSTEM = "Sen o'zbek talabalari uchun yaratilgan AI yordamchisan. Har doim o'zbek tilida javob ber. Aniq, tushunarli va foydali javoblar ber.";

const DEMO_PROMPT = (text: string) => `Quyidagi matnni o'zbek tilida qisqacha xulosa qil. Bu demo uchun — qisqa va ta'sirli bo'lsin.
Format:
📚 Mavzu: (bir qator)
📝 Xulosa: (2-3 jumla)
🔑 Asosiy fikrlar:
• (3-4 ta eng muhim fikr)

Matn: ${text}`;

// Simple rate limit: max 30 requests per minute globally
let requests: number[] = [];
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const now = Date.now();
    requests = requests.filter((t) => now - t < WINDOW_MS);
    if (requests.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Juda ko'p so'rov. Bir oz kuting va qayta urinib ko'ring." },
        { status: 429 }
      );
    }
    requests.push(now);

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Matn kerak" }, { status: 400 });
    }

    // Limit input size for demo
    const trimmed = text.trim().slice(0, 2000);
    if (trimmed.length < 10) {
      return NextResponse.json({ error: "Kamida 10 ta belgi kerak" }, { status: 400 });
    }

    const result = await chatCompletion(DEMO_SYSTEM, DEMO_PROMPT(trimmed));
    return NextResponse.json({ summary: result });
  } catch (e: any) {
    console.error("Demo API error:", e.message);
    return NextResponse.json(
      { error: "AI xatolik berdi. Qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}
