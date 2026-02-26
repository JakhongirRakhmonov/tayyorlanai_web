import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/groq";
import { SYSTEM_PROMPT, SUMMARY_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Matn kerak" }, { status: 400 });
    const trimmed = text.slice(0, 10000);
    const result = await chatCompletion(SYSTEM_PROMPT, SUMMARY_PROMPT(trimmed));
    return NextResponse.json({ summary: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
