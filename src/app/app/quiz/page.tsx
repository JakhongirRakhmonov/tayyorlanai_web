"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveMaterial } from "@/lib/store";

interface Question { question: string; options: string[]; correct: number; }

const countOptions = [5, 10, 15, 20];
const labels = ["A", "B", "C", "D"];

export default function QuizPage() {
  const [material, setMaterial] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(5);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loadingExplain, setLoadingExplain] = useState<Record<number, boolean>>({});
  const [expandedExplain, setExpandedExplain] = useState<Set<number>>(new Set());
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);

  async function generate() {
    if (!material) return;
    setLoading(true);
    setSubmitted(false);
    setShowAnalysis(false);
    setCurrent(0);
    setAnswered(new Set());
    setExplanations({});
    setExpandedExplain(new Set());
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text, count }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.quiz);
      setAnswers(new Array(data.quiz.length).fill(null));
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  function handleAnswer(qi: number, oi: number) {
    if (submitted) return;
    const a = [...answers];
    a[qi] = oi;
    setAnswers(a);
    const newAnswered = new Set(answered);
    newAnswered.add(qi);
    setAnswered(newAnswered);
    // Auto advance after short delay
    setTimeout(() => {
      if (qi < questions.length - 1) setCurrent(qi + 1);
    }, 800);
  }

  async function fetchExplanation(qi: number) {
    if (explanations[qi]) {
      const newExpanded = new Set(expandedExplain);
      if (newExpanded.has(qi)) newExpanded.delete(qi);
      else newExpanded.add(qi);
      setExpandedExplain(newExpanded);
      return;
    }
    setLoadingExplain(prev => ({ ...prev, [qi]: true }));
    const newExpanded = new Set(expandedExplain);
    newExpanded.add(qi);
    setExpandedExplain(newExpanded);
    try {
      const q = questions[qi];
      const res = await fetch("/api/quiz-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          correctAnswer: q.options[q.correct],
          userAnswer: q.options[answers[qi] ?? 0],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExplanations(prev => ({ ...prev, [qi]: data.explanation }));
    } catch (e: any) {
      setExplanations(prev => ({ ...prev, [qi]: "Tushuntirish yuklanmadi: " + e.message }));
    }
    setLoadingExplain(prev => ({ ...prev, [qi]: false }));
  }

  const score = submitted ? answers.filter((a, i) => a === questions[i]?.correct).length : 0;
  const pct = questions.length ? Math.round(score / questions.length * 100) : 0;
  const allAnswered = !answers.includes(null);
  const wrongIndices = submitted ? questions.map((q, i) => answers[i] !== q.correct ? i : -1).filter(i => i >= 0) : [];

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

  // Full analysis screen
  if (showAnalysis) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Score header */}
        <div className={`rounded-2xl p-6 text-center text-white animate-scale-in ${pct >= 70 ? "bg-gradient-to-br from-green-500 to-emerald-600" : pct >= 40 ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-red-500 to-pink-600"}`}>
          <div className="text-4xl mb-2">{pct >= 70 ? "🏆" : pct >= 40 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold">{score}/{questions.length} ({pct}%)</h2>
          <p className="text-white/70 text-sm mt-1">
            {pct >= 70 ? "Ajoyib natija!" : pct >= 40 ? "Yaxshi harakat!" : "Yana o'rganing!"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>✅ To&apos;g&apos;ri: {score}</span>
            <span>❌ Noto&apos;g&apos;ri: {questions.length - score}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* All questions analysis */}
        <h3 className="text-sm font-semibold text-gray-500 px-1">📊 Batafsil tahlil</h3>
        {questions.map((q, qi) => {
          const isCorrect = answers[qi] === q.correct;
          const isWrong = !isCorrect;
          return (
            <div key={qi} className={`rounded-2xl p-5 shadow-sm border animate-slide-up ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              style={{ animationDelay: `${qi * 50}ms`, animationFillMode: 'both' }}>
              <div className="flex items-start gap-2 mb-3">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 ${isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                  {qi + 1}
                </span>
                <p className="font-medium text-sm">{q.question}</p>
              </div>

              <div className="space-y-1.5 ml-9">
                {q.options.map((opt, oi) => {
                  let cls = "text-gray-400 text-xs";
                  if (oi === q.correct) cls = "text-green-700 font-semibold text-sm bg-green-100 px-3 py-1.5 rounded-lg";
                  else if (answers[qi] === oi) cls = "text-red-600 font-medium text-sm bg-red-100 px-3 py-1.5 rounded-lg line-through";
                  else cls = "text-gray-400 text-xs px-3 py-1";
                  return (
                    <div key={oi} className={cls}>
                      {labels[oi]}. {opt}
                      {oi === q.correct && " ✅"}
                      {answers[qi] === oi && oi !== q.correct && " ❌"}
                    </div>
                  );
                })}
              </div>

              {isWrong && (
                <div className="ml-9 mt-3">
                  <button onClick={() => fetchExplanation(qi)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all">
                    {expandedExplain.has(qi) ? "🔼 Yopish" : "❓ Nima uchun?"}
                  </button>
                  {expandedExplain.has(qi) && (
                    <div className="mt-2 bg-white rounded-xl p-4 border border-red-100 text-sm text-gray-700 animate-slide-down">
                      {loadingExplain[qi] ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          Tushuntirish yuklanmoqda...
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{explanations[qi]}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-col gap-3 pt-2">
          <button onClick={generate}
            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all">
            🔄 Yangi test yaratish
          </button>
          <Link href="/app" className="w-full text-center text-gray-400 hover:text-gray-600 text-sm py-2 transition">
            ← Bosh sahifa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">📋 Test</h2>
            <p className="text-sm text-gray-400 truncate">📄 {material.title}</p>
          </div>
        </div>

        {questions.length === 0 && !loading && (
          <>
            <p className="text-sm text-gray-500 mb-3">Nechta savol yaratilsin?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {countOptions.map((c) => (
                <button key={c} onClick={() => setCount(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${count === c ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {c} ta
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all">
              {loading ? "⏳ Kutang..." : "✨ Testni boshlash"}
            </button>
          </>
        )}
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
              <span>Savol {current + 1}/{questions.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${(answers.filter(a => a !== null).length / questions.length * 100)}%` }} />
            </div>
          </div>

          {questions.map((q, qi) => {
            const isAnswered = answered.has(qi);
            const selectedAnswer = answers[qi];
            return (
              <div key={qi} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all animate-slide-up ${!submitted && qi === current ? "ring-2 ring-primary-200" : ""}`}
                style={{ animationDelay: `${qi * 50}ms`, animationFillMode: 'both' }}>
                <p className="font-medium mb-3 text-sm">
                  <span className="inline-block w-7 h-7 bg-gray-100 rounded-lg text-center leading-7 text-xs font-bold mr-2">{qi + 1}</span>
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    let cls = "border-gray-200 hover:border-primary-300 hover:bg-primary-50";
                    if (selectedAnswer === oi && !isAnswered) cls = "border-primary-500 bg-primary-50 shadow-sm";
                    if (isAnswered) {
                      if (oi === q.correct) cls = "border-green-500 bg-green-50";
                      else if (selectedAnswer === oi) cls = "border-red-500 bg-red-50";
                      else cls = "border-gray-100 opacity-60";
                    }
                    return (
                      <button key={oi} disabled={isAnswered}
                        onClick={() => handleAnswer(qi, oi)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${cls}`}>
                        <span className="inline-block w-6 h-6 rounded-lg bg-gray-100 text-center leading-6 text-xs font-bold mr-2">{labels[oi]}</span>
                        {opt}
                        {isAnswered && oi === q.correct && <span className="float-right">✅</span>}
                        {isAnswered && selectedAnswer === oi && oi !== q.correct && <span className="float-right">❌</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted && (
            <button onClick={() => { setSubmitted(true); setShowAnalysis(true); }}
              disabled={!allAnswered}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:shadow-lg transition-all text-base">
              📊 Natijalarni ko&apos;rish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
