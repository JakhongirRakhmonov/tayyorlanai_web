import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/groq";
import { SYSTEM_PROMPT, FLASHCARD_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text, count } = await req.json();
    if (!text) return NextResponse.json({ error: "Matn kerak" }, { status: 400 });
    const numCards = count || 10;
    const result = await chatCompletion(SYSTEM_PROMPT, FLASHCARD_PROMPT(text.slice(0, 10000), numCards));
    const match = result.match(/\[[\s\S]*\]/);
    if (!match) return NextResponse.json({ error: "JSON parse xatosi" }, { status: 500 });
    const flashcards = JSON.parse(match[0]);
    return NextResponse.json({ flashcards });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
