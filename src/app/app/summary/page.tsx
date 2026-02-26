"use client";
import { useState, useEffect } from "react";
import { getActiveMaterial } from "@/lib/store";

export default function SummaryPage() {
  const [material, setMaterial] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate() {
    if (!material) return;
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  if (!material) return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
      <p className="text-4xl mb-3">📝</p>
      <p className="text-gray-500">Avval material yuklang va tanlang</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">📝 Xulosa yaratish</h2>
            <p className="text-sm text-gray-400">Material: {material.title}</p>
          </div>
          <button onClick={generate} disabled={loading}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-primary-700 transition">
            {loading ? "⏳ Yaratilmoqda..." : "✨ Yaratish"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">AI xulosa tayyorlamoqda...</p>
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{summary}</div>
        </div>
      )}
    </div>
  );
}
