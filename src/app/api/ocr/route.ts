import { NextRequest, NextResponse } from "next/server";
import { visionOCR } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { base64 } = await req.json();
    if (!base64) return NextResponse.json({ error: "Rasm kerak" }, { status: 400 });
    const text = await visionOCR(base64);
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
