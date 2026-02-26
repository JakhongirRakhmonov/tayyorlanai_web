import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chatCompletion(system: string, user: string, model = "llama-3.3-70b-versatile") {
  const res = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return res.choices[0]?.message?.content || "";
}

export async function visionOCR(base64Image: string) {
  const res = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Bu rasmdagi barcha matnni aniq ko'chirib yoz. Faqat matni yoz, boshqa hech narsa qo'shma." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
        ],
      },
    ],
    max_tokens: 4096,
  });
  return res.choices[0]?.message?.content || "";
}

export { groq };
