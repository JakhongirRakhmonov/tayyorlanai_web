import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Fayl kerak" }, { status: 400 });

    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      return NextResponse.json({ text: text.slice(0, 10000) });
    }

    if (file.name.endsWith(".pdf")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text.slice(0, 10000) });
    }

    return NextResponse.json({ error: "Faqat PDF va TXT fayllar qo'llab-quvvatlanadi" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
