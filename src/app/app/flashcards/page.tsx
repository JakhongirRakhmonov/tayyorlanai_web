"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveMaterial } from "@/lib/store";

interface Card { question: string; answer: string; }

export default function FlashcardsPage() {
  const [material, setMaterial] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate() {
    if (!material) return;
    setLoading(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCards(data.flashcards);
      setIdx(0);
      setFlipped(false);
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  if (!material) return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border animate-scale-in">
      <div className="text-5xl mb-4 animate-float">🃏</div>
      <p className="text-gray-500 font-medium mb-2">Material tanlanmagan</p>
      <p className="text-gray-400 text-sm mb-4">Avval material yuklang va tanlang</p>
      <Link href="/app" className="inline-block bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition">
        ← Materiallarga qaytish
      </Link>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">🃏 Flashcardlar</h2>
          <p className="text-sm text-gray-400 truncate">📄 {material.title}</p>
        </div>
        <button onClick={generate} disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all flex-shrink-0">
          {loading ? "⏳ Kutang..." : "✨ Yaratish"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border text-center animate-scale-in">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Flashcardlar yaratilmoqda...</p>
        </div>
      )}

      {cards.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <div className="flip-card w-full h-64 cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
            <div className={`flip-card-inner w-full h-full ${flipped ? "flipped" : ""}`}>
              <div className="flip-card-front bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-xl">
                <div className="absolute top-3 left-4 text-xs opacity-50">SAVOL</div>
                <div className="absolute top-3 right-4 text-xs opacity-50">{idx + 1}/{cards.length}</div>
                <p className="text-lg font-medium text-center leading-relaxed">{cards[idx].question}</p>
                <p className="absolute bottom-3 text-xs opacity-40">👆 Javobni ko&apos;rish uchun bosing</p>
              </div>
              <div className="flip-card-back bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-xl">
                <div className="absolute top-3 left-4 text-xs opacity-50">JAVOB</div>
                <div className="absolute top-3 right-4 text-xs opacity-50">{idx + 1}/{cards.length}</div>
                <p className="text-lg font-medium text-center leading-relaxed">{cards[idx].answer}</p>
                <p className="absolute bottom-3 text-xs opacity-40">👆 Savolga qaytish</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-sm border">
            <button onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }}
              disabled={idx === 0}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-medium disabled:opacity-30 hover:bg-gray-200 transition">
              ← Oldingi
            </button>
            <div className="flex gap-1">
              {cards.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition ${i === idx ? "bg-primary-600 scale-125" : "bg-gray-200"}`} />
              ))}
            </div>
            <button onClick={() => { setIdx(Math.min(cards.length - 1, idx + 1)); setFlipped(false); }}
              disabled={idx === cards.length - 1}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-medium disabled:opacity-30 hover:bg-gray-200 transition">
              Keyingi →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
