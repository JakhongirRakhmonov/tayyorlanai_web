import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/groq";
import { SYSTEM_PROMPT, CHAT_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text, question } = await req.json();
    if (!question) return NextResponse.json({ error: "Savol kerak" }, { status: 400 });
    const prompt = text ? CHAT_PROMPT(text.slice(0, 10000), question) : question;
    const result = await chatCompletion(SYSTEM_PROMPT, prompt);
    return NextResponse.json({ answer: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
