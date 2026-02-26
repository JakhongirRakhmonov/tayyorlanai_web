"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getActiveMaterial } from "@/lib/store";

export default function SummaryPage() {
  const [material, setMaterial] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const generated = useRef(false);

  useEffect(() => {
    const m = getActiveMaterial();
    setMaterial(m);
    if (m && !generated.current) {
      generated.current = true;
      generateSummary(m);
    }
  }, []);

  async function generateSummary(mat: any) {
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mat.text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  if (!material) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center shadow-sm border dark:border-gray-800 animate-scale-in">
      <div className="text-5xl mb-4 animate-float">📝</div>
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">Material tanlanmagan</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Avval material yuklang va tanlang</p>
      <Link href="/app" className="inline-block bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition">
        ← Materiallarga qaytish
      </Link>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border dark:border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold flex items-center gap-2">📝 Xulosa</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 truncate">📄 {material.title}</p>
          </div>
          <button onClick={() => generateSummary(material)} disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all flex-shrink-0">
            {loading ? "⏳ Kutang..." : "🔄 Qayta yaratish"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border text-center animate-scale-in">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">AI xulosa tayyorlamoqda...</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Bu bir necha soniya davom etishi mumkin</p>
        </div>
      )}

      {summary && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 flex items-center gap-2">
            <span className="text-white text-lg">✅</span>
            <span className="font-semibold text-sm text-white">Xulosa tayyor</span>
          </div>
          <div className="p-5">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</div>
          </div>
        </div>
      )}
    </div>
  );
}
