"use client";
import { useState, useEffect } from "react";
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
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
      <p className="text-4xl mb-3">🃏</p>
      <p className="text-gray-500">Avval material yuklang va tanlang</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">🃏 Flashcardlar</h2>
          <p className="text-sm text-gray-400">Material: {material.title}</p>
        </div>
        <button onClick={generate} disabled={loading}
          className="bg-accent-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-accent-700 transition">
          {loading ? "⏳ Yaratilmoqda..." : "✨ Yaratish"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <div className="w-8 h-8 border-3 border-accent-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Flashcardlar yaratilmoqda...</p>
        </div>
      )}

      {cards.length > 0 && (
        <div className="space-y-4">
          <div className="flip-card w-full h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
            <div className={`flip-card-inner w-full h-full ${flipped ? "flipped" : ""}`}>
              <div className="flip-card-front bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                <p className="text-xs opacity-70 mb-2">SAVOL</p>
                <p className="text-lg font-medium text-center">{cards[idx].question}</p>
                <p className="text-xs opacity-50 mt-4">Javobni ko'rish uchun bosing</p>
              </div>
              <div className="flip-card-back bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                <p className="text-xs opacity-70 mb-2">JAVOB</p>
                <p className="text-lg font-medium text-center">{cards[idx].answer}</p>
                <p className="text-xs opacity-50 mt-4">Savolga qaytish uchun bosing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border">
            <button onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }}
              disabled={idx === 0}
              className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium disabled:opacity-30 hover:bg-gray-200 transition">
              ← Oldingi
            </button>
            <span className="text-sm text-gray-500">{idx + 1} / {cards.length}</span>
            <button onClick={() => { setIdx(Math.min(cards.length - 1, idx + 1)); setFlipped(false); }}
              disabled={idx === cards.length - 1}
              className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium disabled:opacity-30 hover:bg-gray-200 transition">
              Keyingi →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
