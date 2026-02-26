"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveMaterial } from "@/lib/store";

interface Card { question: string; answer: string; }

const countOptions = [5, 10, 15, 20, 30];

export default function FlashcardsPage() {
  const [material, setMaterial] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const [activeCards, setActiveCards] = useState<Card[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate(customCards?: Card[]) {
    if (customCards) {
      // retry mode
      setRetryMode(true);
      setActiveCards(customCards);
      setActiveIndices(customCards.map((_, i) => i));
      setIdx(0);
      setFlipped(false);
      setKnown(new Set());
      setUnknown(new Set());
      setFinished(false);
      return;
    }
    if (!material) return;
    setLoading(true);
    setRetryMode(false);
    setFinished(false);
    setKnown(new Set());
    setUnknown(new Set());
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text, count }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCards(data.flashcards);
      setActiveCards(data.flashcards);
      setActiveIndices(data.flashcards.map((_: Card, i: number) => i));
      setIdx(0);
      setFlipped(false);
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  function handleKnow() {
    const newKnown = new Set(known);
    newKnown.add(idx);
    setKnown(newKnown);
    advance(newKnown, unknown);
  }

  function handleDontKnow() {
    const newUnknown = new Set(unknown);
    newUnknown.add(idx);
    setUnknown(newUnknown);
    advance(known, newUnknown);
  }

  function advance(k: Set<number>, u: Set<number>) {
    if (k.size + u.size >= activeCards.length) {
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  }

  function retryUnknown() {
    const unknownCards = Array.from(unknown).map(i => activeCards[i]);
    generate(unknownCards);
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

  // Finished screen
  if (finished) {
    const knownCount = known.size;
    const unknownCount = unknown.size;
    const total = activeCards.length;
    const pct = Math.round((knownCount / total) * 100);
    return (
      <div className="space-y-4 animate-fade-in">
        <div className={`rounded-2xl p-8 text-center text-white animate-scale-in ${pct >= 70 ? "bg-gradient-to-br from-green-500 to-emerald-600" : pct >= 40 ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-red-500 to-pink-600"}`}>
          <div className="text-5xl mb-3">{pct >= 70 ? "🏆" : pct >= 40 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold mb-2">Natija: {pct}%</h2>
          <p className="text-white/80 text-lg">
            ✅ Bilaman: {knownCount} | ❌ Bilmayman: {unknownCount}
          </p>
          <p className="text-white/60 text-sm mt-1">Jami: {total} ta kartochka</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{knownCount}</div>
              <div className="text-sm text-green-600/70">✅ Bilaman</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <div className="text-2xl font-bold text-red-600">{unknownCount}</div>
              <div className="text-sm text-red-600/70">❌ Bilmayman</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {unknownCount > 0 && (
            <button onClick={retryUnknown}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all">
              🔄 Bilmaganlarni qayta o&apos;rganish ({unknownCount} ta)
            </button>
          )}
          <button onClick={() => generate()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all">
            ✨ Yangi kartochkalar yaratish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">🃏 Flashcardlar</h2>
            <p className="text-sm text-gray-400 truncate">📄 {material.title}</p>
          </div>
        </div>

        {activeCards.length === 0 && (
          <>
            <p className="text-sm text-gray-500 mb-3">Nechta kartochka yaratilsin?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {countOptions.map((c) => (
                <button key={c} onClick={() => setCount(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${count === c ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {c} ta
                </button>
              ))}
            </div>
            <button onClick={() => generate()} disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all">
              {loading ? "⏳ Kutang..." : "✨ Yaratish"}
            </button>
          </>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border text-center animate-scale-in">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Flashcardlar yaratilmoqda...</p>
        </div>
      )}

      {activeCards.length > 0 && !finished && (
        <div className="space-y-4 animate-slide-up">
          {/* Progress */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-gray-400">{idx + 1}/{activeCards.length}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${((known.size + unknown.size) / activeCards.length) * 100}%` }} />
            </div>
            <span className="text-xs text-green-500">✅{known.size}</span>
            <span className="text-xs text-red-500">❌{unknown.size}</span>
          </div>

          <div className="flip-card w-full h-64 cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
            <div className={`flip-card-inner w-full h-full ${flipped ? "flipped" : ""}`}>
              <div className="flip-card-front bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-xl">
                <div className="absolute top-3 left-4 text-xs opacity-50">SAVOL</div>
                <div className="absolute top-3 right-4 text-xs opacity-50">{idx + 1}/{activeCards.length}</div>
                <p className="text-lg font-medium text-center leading-relaxed">{activeCards[idx]?.question}</p>
                <p className="absolute bottom-3 text-xs opacity-40">👆 Javobni ko&apos;rish uchun bosing</p>
              </div>
              <div className="flip-card-back bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-xl">
                <div className="absolute top-3 left-4 text-xs opacity-50">JAVOB</div>
                <div className="absolute top-3 right-4 text-xs opacity-50">{idx + 1}/{activeCards.length}</div>
                <p className="text-lg font-medium text-center leading-relaxed">{activeCards[idx]?.answer}</p>
              </div>
            </div>
          </div>

          {/* Know / Don't know buttons - show only when flipped */}
          {flipped && (
            <div className="flex gap-3 animate-slide-up">
              <button onClick={handleDontKnow}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all text-base">
                ❌ Bilmayman
              </button>
              <button onClick={handleKnow}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all text-base">
                ✅ Bilaman
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
