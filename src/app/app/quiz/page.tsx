"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveMaterial } from "@/lib/store";

interface Question { question: string; options: string[]; correct: number; }

export default function QuizPage() {
  const [material, setMaterial] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate() {
    if (!material) return;
    setLoading(true);
    setSubmitted(false);
    setCurrent(0);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.quiz);
      setAnswers(new Array(data.quiz.length).fill(null));
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  const score = submitted ? answers.filter((a, i) => a === questions[i]?.correct).length : 0;
  const pct = questions.length ? Math.round(score / questions.length * 100) : 0;
  const labels = ["A", "B", "C", "D"];
  const allAnswered = !answers.includes(null);

  if (!material) return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border animate-scale-in">
      <div className="text-5xl mb-4 animate-float">📋</div>
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
          <h2 className="text-lg font-semibold">📋 Test</h2>
          <p className="text-sm text-gray-400 truncate">📄 {material.title}</p>
        </div>
        <button onClick={generate} disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all flex-shrink-0">
          {loading ? "⏳ Kutang..." : "✨ Yaratish"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border text-center animate-scale-in">
          <div className="w-10 h-10 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Test savollari yaratilmoqda...</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Javob berildi: {answers.filter(a => a !== null).length}/{questions.length}</span>
              {submitted && <span className="font-bold text-lg">{pct >= 70 ? "🎉" : pct >= 40 ? "😐" : "😔"} {score}/{questions.length} ({pct}%)</span>}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${submitted ? (pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500") : "bg-gradient-to-r from-green-500 to-emerald-600"}`}
                style={{ width: `${submitted ? pct : (answers.filter(a => a !== null).length / questions.length * 100)}%` }} />
            </div>
          </div>

          {submitted && (
            <div className={`rounded-2xl p-5 text-center text-white font-bold text-xl animate-scale-in ${pct >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-600" : pct >= 40 ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-red-500 to-pink-600"}`}>
              {pct >= 70 ? "🏆 Ajoyib natija!" : pct >= 40 ? "👍 Yaxshi harakat!" : "📚 Yana o'rganing!"} — {score}/{questions.length}
            </div>
          )}

          {questions.map((q, qi) => (
            <div key={qi} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all animate-slide-up ${!submitted && qi === current ? "ring-2 ring-primary-200" : ""}`}
              style={{ animationDelay: `${qi * 50}ms`, animationFillMode: 'both' }}>
              <p className="font-medium mb-3 text-sm">
                <span className="inline-block w-7 h-7 bg-gray-100 rounded-lg text-center leading-7 text-xs font-bold mr-2">{qi + 1}</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let cls = "border-gray-200 hover:border-primary-300 hover:bg-primary-50";
                  if (answers[qi] === oi && !submitted) cls = "border-primary-500 bg-primary-50 shadow-sm";
                  if (submitted) {
                    if (oi === q.correct) cls = "border-green-500 bg-green-50";
                    else if (answers[qi] === oi) cls = "border-red-500 bg-red-50";
                    else cls = "border-gray-100 opacity-60";
                  }
                  return (
                    <button key={oi} disabled={submitted}
                      onClick={() => { const a = [...answers]; a[qi] = oi; setAnswers(a); setCurrent(qi + 1); }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${cls}`}>
                      <span className="inline-block w-6 h-6 rounded-lg bg-gray-100 text-center leading-6 text-xs font-bold mr-2">{labels[oi]}</span>
                      {opt}
                      {submitted && oi === q.correct && <span className="float-right">✅</span>}
                      {submitted && answers[qi] === oi && oi !== q.correct && <span className="float-right">❌</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted && (
            <button onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:shadow-lg transition-all text-base">
              ✅ Tekshirish
            </button>
          )}
          {submitted && (
            <button onClick={generate}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all text-base">
              🔄 Qayta yaratish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
