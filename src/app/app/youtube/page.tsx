"use client";
import { useState } from "react";
import Link from "next/link";
import { saveMaterial, setActiveMaterialId } from "@/lib/store";

export default function YouTubePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    summary: string;
    transcript: string;
    videoId: string;
    charCount: number;
  } | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    if (!url.trim() || loading) return;
    setError("");
    setResult(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  function handleSaveAsMaterial() {
    if (!result) return;
    const m = {
      id: Date.now().toString(),
      title: `🎬 YouTube video`,
      text: result.transcript,
      createdAt: Date.now(),
    };
    saveMaterial(m);
    setActiveMaterialId(m.id);
    setSaved(true);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xl">
            ▶
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">YouTube Video Xulosa</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">Video havolasini kiriting — AI xulosa yaratadi</p>
          </div>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); setResult(null); setSaved(false); }}
              placeholder="https://youtube.com/watch?v=... yoki youtu.be/..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">🔗</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!url.trim() || loading}
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-40 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex-shrink-0"
          >
            {loading ? "⏳" : "⚡"} Xulosa
          </button>
        </div>

        {/* Sample links */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">Namuna:</span>
          {[
            { label: "📚 Darslik", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => { setUrl(s.url); setError(""); setResult(null); }}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 shadow-sm border dark:border-gray-800 text-center animate-scale-in">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Video matni yuklanmoqda va xulosa tayyorlanmoqda...</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Bu bir necha soniya davom etishi mumkin</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-700 dark:text-red-400 font-medium text-sm">{error}</p>
              <p className="text-red-500/70 dark:text-red-500/50 text-xs mt-1">
                Video subtitrli bo&apos;lishi kerak. Boshqa video sinab ko&apos;ring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          {/* Video preview */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden animate-slide-up">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${result.videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-5 py-3 flex items-center justify-between border-t dark:border-gray-800">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                📊 {result.charCount.toLocaleString()} ta belgi transkript
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 flex items-center gap-2">
              <span className="text-white text-lg">✅</span>
              <span className="font-semibold text-sm text-white">Video xulosa tayyor</span>
            </div>
            <div className="p-5">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {result.summary}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border dark:border-gray-800 animate-slide-up">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              📌 Video matnini material sifatida saqlang — keyin flashcard, test va chat yarating
            </p>
            {!saved ? (
              <button
                onClick={handleSaveAsMaterial}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.01] transition-all"
              >
                💾 Material sifatida saqlash
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                  <span className="text-lg">✅</span>
                  <span className="font-medium text-sm">Saqlandi!</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { href: "/app/summary", icon: "📝", label: "Xulosa", color: "from-blue-500 to-indigo-600" },
                    { href: "/app/flashcards", icon: "🃏", label: "Flashcard", color: "from-purple-500 to-pink-600" },
                    { href: "/app/quiz", icon: "📋", label: "Test", color: "from-green-500 to-emerald-600" },
                    { href: "/app/chat", icon: "💬", label: "Chat", color: "from-orange-500 to-red-500" },
                  ].map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`bg-gradient-to-br ${t.color} text-white rounded-xl p-3 text-center hover:shadow-lg hover:scale-105 transition-all`}
                    >
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-xs font-semibold">{t.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
