import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { chatCompletion } from "@/lib/groq";
import { SYSTEM_PROMPT, SUMMARY_PROMPT } from "@/lib/prompts";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "YouTube havolasi kerak" }, { status: 400 });
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      return NextResponse.json(
        { error: "Noto'g'ri YouTube havolasi. Iltimos, to'g'ri havola kiriting." },
        { status: 400 }
      );
    }

    // Fetch transcript
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch {
      return NextResponse.json(
        { error: "Bu videoda avtomatik matn topilmadi. Faqat subtitrli videolar ishlaydi." },
        { status: 404 }
      );
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json(
        { error: "Bu videoda avtomatik matn topilmadi. Faqat subtitrli videolar ishlaydi." },
        { status: 404 }
      );
    }

    // Combine transcript text
    const fullText = transcriptItems.map((item) => item.text).join(" ");
    const trimmed = fullText.slice(0, 10000);

    if (trimmed.length < 10) {
      return NextResponse.json(
        { error: "Video matni juda qisqa. Boshqa video sinab ko'ring." },
        { status: 400 }
      );
    }

    // Generate summary using existing Groq setup
    const summary = await chatCompletion(SYSTEM_PROMPT, SUMMARY_PROMPT(trimmed));

    return NextResponse.json({
      summary,
      transcript: trimmed,
      videoId,
      charCount: trimmed.length,
    });
  } catch (e: any) {
    console.error("YouTube API error:", e.message);
    return NextResponse.json(
      { error: "Xatolik yuz berdi. Qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}
