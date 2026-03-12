"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   Hero Product Preview — Interactive UI showing the real product
   ═══════════════════════════════════════════════════ */
function HeroProduct() {
  const [phase, setPhase] = useState<"input" | "processing" | "result">("input");
  const [inputText, setInputText] = useState("");
  const [typedResult, setTypedResult] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "flashcard" | "test">("summary");

  const sampleText = "Fotosintez — o'simliklar yorug'lik energiyasidan foydalanib, karbonat angidrid va suvdan organik moddalar hosil qilish jarayoni. Bu jarayon xloroplastlarda sodir bo'ladi. Yorug'lik fazasi tilakoidlarda, qorong'i fazasi stromada amalga oshadi.";

  const resultText = `📚 Mavzu: Fotosintez

📝 Xulosa: Fotosintez — o'simliklar yorug'lik yordamida organik moddalar yaratish jarayoni. Xloroplastlarda ikki fazada sodir bo'ladi.

🔑 Asosiy fikrlar:
• Yorug'lik energiyasi → organik modda
• Xloroplastlarda amalga oshadi
• Yorug'lik fazasi (tilakoid) va qorong'i faza (stroma)
• Natija: kislorod + glyukoza`;

  const flashcardResult = `🃏 Flashcard 1/5

❓ Fotosintez nima?

🤔 Javobni ko'rish uchun bosing...`;

  const testResult = `📋 Test: Fotosintez

1. Fotosintez qayerda sodir bo'ladi?
   ○ A) Mitoxondriya
   ● B) Xloroplast  ✅
   ○ C) Yadro
   ○ D) Ribosoma

🟩⬜⬜⬜⬜  1/5`;

  // Auto-type the sample text
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < sampleText.length) {
        setInputText(sampleText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        // Auto-trigger processing after typing
        setTimeout(() => {
          setPhase("processing");
          setTimeout(() => {
            setPhase("result");
            // Typewriter for result
            let j = 0;
            const rTimer = setInterval(() => {
              j += 2;
              setTypedResult(resultText.slice(0, j));
              if (j >= resultText.length) clearInterval(rTimer);
            }, 15);
          }, 1500);
        }, 800);
      }
    }, 25);
    return () => clearInterval(timer);
  }, []);

  const currentResult = activeTab === "summary" ? typedResult : activeTab === "flashcard" ? flashcardResult : testResult;

  return (
    <div className="w-full max-w-[560px]">
      <div className="bg-[#0d0d1a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        {/* Window header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="text-[11px] text-gray-500 font-medium">TayyorlanAI</div>
          <div className="w-12" />
        </div>

        {/* Input section */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">📤 Material kiriting</span>
            {phase === "input" && (
              <span className="text-[10px] text-indigo-400 animate-pulse">yozilmoqda...</span>
            )}
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 min-h-[80px] text-[12px] text-gray-300 leading-relaxed font-mono">
            {inputText}
            {phase === "input" && <span className="inline-block w-[2px] h-3.5 bg-indigo-400 animate-pulse ml-0.5 -mb-0.5" />}
          </div>
          
          {/* Input type indicators */}
          <div className="flex gap-2 mt-2">
            {["📝 Matn", "📄 PDF", "📸 Rasm", "▶️ YouTube"].map((label, i) => (
              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md ${i === 0 ? "bg-indigo-500/20 text-indigo-300" : i === 3 ? "bg-red-500/20 text-red-300" : "bg-white/[0.04] text-gray-600"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Processing indicator */}
        {phase === "processing" && (
          <div className="p-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-sm text-gray-400">AI ishlayapti...</span>
          </div>
        )}

        {/* Result section */}
        {phase === "result" && (
          <div className="p-4">
            {/* Tabs */}
            <div className="flex gap-1 mb-3">
              {([["summary", "📝 Xulosa"], ["flashcard", "🃏 Flashcard"], ["test", "📋 Test"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === key
                      ? "bg-indigo-600 text-white"
                      : "bg-white/[0.04] text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Result content */}
            <div className="bg-indigo-500/[0.06] border border-indigo-500/15 rounded-xl p-4">
              <pre className="whitespace-pre-wrap font-sans text-[12px] text-gray-200 leading-relaxed">
                {currentResult}
              </pre>
            </div>

            {/* Action hint */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-gray-600">✨ Haqiqiy AI natija</span>
              <span className="text-[10px] text-indigo-400">💬 Chat bilan savol bering →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Live Demo — REAL Groq API call
   ═══════════════════════════════════════════════════ */
function LiveDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const samples = [
    { label: "🧬 Biologiya", text: "Fotosintez — o'simliklar yorug'lik energiyasidan foydalanib, karbonat angidrid va suvdan organik moddalar hosil qilish jarayoni. Bu jarayon xloroplastlarda sodir bo'ladi. Yorug'lik fazasi tilakoidlarda, qorong'i fazasi stromada amalga oshadi. Natijada kislorod ajraladi va glyukoza hosil bo'ladi." },
    { label: "⚛️ Fizika", text: "Nyutonning ikkinchi qonuni: jismga ta'sir qilayotgan kuch, jism massasi va tezlanish ko'paytmasiga teng (F=ma). Agar kuch oshsa, tezlanish ham oshadi. Massa oshsa, tezlanish kamayadi. Bu qonun dinamikaning asosiy qonunidir." },
    { label: "📊 Iqtisod", text: "Talab va taklif qonuni: narx oshganda talab kamayadi, narx tushganda talab ortadi. Bozor muvozanati — talab va taklif tenglik nuqtasida vujudga keladi." },
  ];

  async function handleSubmit() {
    if (!input.trim() || loading) return;
    setError(""); setResult(""); setLoading(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      let i = 0;
      const full = data.summary;
      const t = setInterval(() => {
        i += 3;
        setResult(full.slice(0, i));
        if (i >= full.length) clearInterval(t);
      }, 10);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">AI tayyor — o'z materialingizni kiriting</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(""); setError(""); }}
            placeholder="Konspekt, kitob matnini yoki har qanday o'quv materialini shu yerga yozing..."
            className="w-full h-32 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {samples.map((s, i) => (
              <button key={i} onClick={() => { setInput(s.text); setResult(""); setError(""); }}
                className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all">
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          {!result && !loading && !error && (
            <button onClick={handleSubmit} disabled={!input.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.04] disabled:text-gray-600 text-white py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              ⚡ AI bilan xulosa yaratish
            </button>
          )}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-400">AI ishlayapti...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
              {error}
              <button onClick={handleSubmit} className="ml-2 underline hover:text-red-300">Qayta urinish</button>
            </div>
          )}
          {result && (
            <div>
              <div className="bg-indigo-500/[0.07] border border-indigo-500/20 rounded-xl p-5 mb-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200 leading-relaxed">{result}</pre>
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">Bu haqiqiy AI natija ✨ Flashcard va test ham shu tarzda yaratiladi</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium text-center transition-all text-sm">
                  🤖 Telegram'da davom eting
                </a>
                <Link href="/app"
                  className="flex-1 border border-white/10 hover:border-white/20 text-gray-300 py-3 rounded-xl font-medium text-center transition-all text-sm hover:bg-white/[0.03]">
                  🌐 Web versiyada oching
                </Link>
              </div>
              <button onClick={() => { setResult(""); setInput(""); setError(""); }}
                className="w-full mt-3 text-xs text-gray-600 hover:text-gray-400 transition py-1">
                ↻ Boshqa material sinash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "Bu haqiqatan ham bepulmi?", a: "Ha, to'liq bepul. Telegram bot va web versiya ikkalasi ham bepul ishlaydi. Hech qanday yashirin to'lov yo'q." },
    { q: "Qanday materiallar qabul qilinadi?", a: "Matn (yozib yuborsangiz), PDF fayl va rasmlar (daftardagi yozuvlar, doska suratlari). AI hammasini o'qiy oladi." },
    { q: "Faqat o'zbek tilida ishlaydi-mi?", a: "Asosan o'zbek tilida, lekin rus va ingliz tillarini ham tushunadi. /lang buyrug'i orqali tilni o'zgartirishingiz mumkin." },
    { q: "Ma'lumotlarim xavfsiz-mi?", a: "Ma'lumotlaringiz faqat sizning o'quv materiallaringizni qayta ishlash uchun ishlatiladi. Boshqa hech kimga uzatilmaydi." },
    { q: "Qanday fan bo'yicha ishlaydi?", a: "Barcha fanlar — biologiya, fizika, matematika, tarix, iqtisod va boshqalar. AI har qanday mavzudagi materialni qayta ishlaydi." },
    { q: "Telegram botdan qanday foydalanaman?", a: "Telegramda @TayyorlanAI_bot ni toping, /start bosing va material yuboring. Shu — boshqa hech narsa kerak emas." },
  ];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
        {items.map((item, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm pr-4">{item.q}</span>
              <span className={`text-gray-500 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
            </div>
            {open === i && <p className="mt-3 text-sm text-gray-400 leading-relaxed">{item.a}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Counter (viewport-triggered)
   ═══════════════════════════════════════════════════ */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.5 });
    ref.current && obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    let c = 0; const inc = target / 25;
    const t = setInterval(() => { c += inc; if (c >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(c)); }, 40);
    return () => clearInterval(t);
  }, [visible, target]);
  return <div ref={ref}>{count}{suffix}</div>;
}

/* ═══════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08080f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-3 max-w-6xl mx-auto">
          <Link href="/" className="text-lg font-bold tracking-tight">🎓 TayyorlanAI</Link>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-gray-500 hover:text-white transition hidden sm:block">Web versiya</Link>
            <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
              Boshlash →
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-8 md:pt-36 md:pb-16 px-5">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-60 left-0 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          {/* Text center */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              O'zbekistondagi birinchi AI o'quv yordamchi
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 tracking-tight">
              Materialni yuboring.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI o'rgatadi.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Matn yozing, fayl tashlang, rasm yuboring yoki <span className="text-red-400 font-medium">YouTube havolasini joylashtiring</span> — AI xulosa, flashcard va test yaratadi.
              <span className="text-gray-300"> O'zbek tilida. Bepul.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram'da boshlash
                <span className="text-indigo-300 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
              <Link href="/app"
                className="inline-flex items-center justify-center gap-2 border border-white/[0.08] hover:border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:bg-white/[0.03]">
                🌐 Web versiyada sinash
              </Link>
            </div>
          </div>

          {/* Product preview — centered, interactive */}
          <div className="flex justify-center">
            <HeroProduct />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">Material yuboring — AI qolganini qiladi</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Matn, rasm yoki fayl. Qaysi formatda bo'lsa ham ishlaydi.</p>
          </div>
          {/* YouTube feature highlight */}
          <div className="relative bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6 md:p-8 mb-6 group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full animate-pulse">YANGI</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="text-5xl group-hover:scale-110 transition-transform">🎬</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">YouTube Video Xulosa</h3>
                <p className="text-gray-400 leading-relaxed">YouTube havolasini joylashtiring — AI video mazmunini o&apos;zbek tilida xulosa qiladi. Keyin flashcard va test ham yarating!</p>
              </div>
              <Link href="/app/youtube" className="flex-shrink-0 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-500/25">
                Sinab ko&apos;rish →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📝", title: "Xulosa", desc: "Uzun materialni bir necha soniyada qisqartiradi. Asosiy fikrlarni alohida ajratib beradi.", gradient: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/15" },
              { icon: "🃏", title: "Flashcard", desc: "Savol-javob kartochkalari yaratadi. ✅ Bilardim / ❌ Bilmadim — o'zingiz baholang. Noto'g'rilarni qayta o'rganing.", gradient: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/15" },
              { icon: "📋", title: "Test", desc: "Materialdan test savollar yaratadi. Bilimingizni 5, 10 yoki 20 savollik test bilan tekshiring.", gradient: "from-emerald-500/10 to-green-500/10", border: "border-emerald-500/15" },
              { icon: "💬", title: "AI Chat", desc: "Tushunmagan narsangizni so'rang. AI material asosida o'zbek tilida tushuntiradi.", gradient: "from-orange-500/10 to-amber-500/10", border: "border-orange-500/15" },
            ].map((f, i) => (
              <div key={i} className={`group bg-gradient-to-br ${f.gradient} border ${f.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Demo ── */}
      <section id="demo" className="py-20 md:py-28 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/[0.04] via-indigo-600/[0.02] to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">O'zingiz sinab ko'ring ⚡</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Material yozing — haqiqiy AI natijani ko'ring. Bu demo emas, bu haqiqiy AI.</p>
          </div>
          <LiveDemo />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14 tracking-tight">Qanday ishlaydi?</h2>
          <div className="space-y-8">
            {[
              { num: "1", title: "Material yuboring", desc: "Matn yozing, rasm yuboring, PDF tashlang yoki YouTube havolasini joylashtiring. Daftar surati ham ishlaydi — AI hammasini o'qiy oladi." },
              { num: "2", title: "AI qayta ishlaydi", desc: "Bir necha soniyada xulosa avtomatik tayyor. Keyin flashcard, test yoki chat tanlaysiz." },
              { num: "3", title: "O'rganing va tekshiring", desc: "Flashcard bilan eslab qoling, test bilan tekshiring, chat orqali savollaringizga javob oling." },
            ].map((s, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform">{s.num}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14 tracking-tight">Foydalanuvchilar fikri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {[
              { text: "To'g'risi kutganimdan ancha yaxshi, eng asosiysi tekin, ishlatishga qulay. Sodda va user friendly. Do'stlarimga albatta tavsiya qilaman!", name: "Aerospace Engineer", role: "Kelajakdagi MIT talabasi", emoji: "🚀" },
              { text: "All good, nothing more or less. Perfect!!!", name: "Bekhruz", role: "Foydalanuvchi", emoji: "👨‍💻" },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-colors">
                <p className="text-gray-300 mb-5 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg">{t.emoji}</div>
                  <div><div className="font-medium text-sm">{t.name}</div><div className="text-xs text-gray-500">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            <div className="text-center"><div className="text-4xl font-bold text-indigo-400"><Counter target={73} suffix="+" /></div><div className="text-sm text-gray-500 mt-1">foydalanuvchi</div></div>
            <div className="text-center"><div className="text-4xl font-bold text-emerald-400">Bepul</div><div className="text-sm text-gray-500 mt-1">to'lov yo'q</div></div>
            <div className="text-center"><div className="text-4xl font-bold">🇺🇿</div><div className="text-sm text-gray-500 mt-1">o'zbek tilida</div></div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14 tracking-tight">Ko'p beriladigan savollar</h2>
          <FAQ />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-10 md:p-16 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="relative text-3xl md:text-4xl font-bold mb-4 tracking-tight">Imtihonga tayyormisiz? 🎓</h2>
            <p className="relative text-gray-400 mb-8 text-lg leading-relaxed">Material yuboring — AI xulosa, flashcard va test yaratsin.</p>
            <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/25">
                🤖 Telegram Bot
              </a>
              <Link href="/app"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:bg-white/[0.03]">
                🌐 Web versiya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600">© 2026 TayyorlanAI</span>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🤖 Bot</a>
            <a href="https://t.me/rahmonovvlog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📢 Kanal</a>
            <a href="https://t.me/Developer_John" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">💬 Bog'lanish</a>
            <a href="https://www.instagram.com/rakhmonovv.001" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📸 Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
