"use client";
import { useState, useEffect } from "react";
import { getActiveMaterial } from "@/lib/store";

interface Question { question: string; options: string[]; correct: number; }

export default function QuizPage() {
  const [material, setMaterial] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate() {
    if (!material) return;
    setLoading(true);
    setSubmitted(false);
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
  const labels = ["A", "B", "C", "D"];

  if (!material) return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
      <p className="text-4xl mb-3">📋</p>
      <p className="text-gray-500">Avval material yuklang va tanlang</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">📋 Test</h2>
          <p className="text-sm text-gray-400">Material: {material.title}</p>
        </div>
        <button onClick={generate} disabled={loading}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-green-700 transition">
          {loading ? "⏳ Yaratilmoqda..." : "✨ Yaratish"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Test savollari yaratilmoqda...</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          {submitted && (
            <div className={`rounded-2xl p-6 text-center text-white font-semibold text-lg ${score >= questions.length * 0.7 ? "bg-green-500" : score >= questions.length * 0.4 ? "bg-yellow-500" : "bg-red-500"}`}>
              🏆 Natija: {score}/{questions.length} ({Math.round(score / questions.length * 100)}%)
            </div>
          )}

          {questions.map((q, qi) => (
            <div key={qi} className="bg-white rounded-2xl p-5 shadow-sm border">
              <p className="font-medium mb-3 text-sm">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let cls = "border-gray-200 hover:border-primary-300 hover:bg-primary-50";
                  if (answers[qi] === oi && !submitted) cls = "border-primary-500 bg-primary-50";
                  if (submitted) {
                    if (oi === q.correct) cls = "border-green-500 bg-green-50";
                    else if (answers[qi] === oi) cls = "border-red-500 bg-red-50";
                  }
                  return (
                    <button key={oi} disabled={submitted}
                      onClick={() => { const a = [...answers]; a[qi] = oi; setAnswers(a); }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${cls}`}>
                      <span className="font-medium mr-2">{labels[oi]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted && (
            <button onClick={() => setSubmitted(true)}
              disabled={answers.includes(null)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-green-700 transition">
              ✅ Tekshirish
            </button>
          )}
          {submitted && (
            <button onClick={generate}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition">
              🔄 Qayta yaratish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
