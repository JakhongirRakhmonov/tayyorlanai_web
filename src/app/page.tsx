"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Phone mockup showing realistic bot conversation ─── */
function BotMockup() {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "user", text: "Menga biologiya bo'yicha konspektim bor, shu haqida xulosa va test kerak" },
    { from: "bot", text: "📤 Material yuboring! Matn yozing, PDF yuboring yoki rasm tashlang — har qanday formatda qabul qilaman! 👇" },
    { from: "user", text: "Hujayra — tirik organizmlarning eng kichik strukturaviy va funksional birligi. Hujayra membranasi, yadro, sitoplazma va organoidlardan tashkil topgan..." },
    { from: "bot", text: "⚡ Material qabul qilindi!\n\n📚 Hujayra biologiyasi\n\n📝 Xulosa: Hujayra — tirik organizmning asosiy birligi bo'lib, membrana, yadro va organoidlardan iborat...\n\n🔑 Asosiy fikrlar:\n• Hujayra tuzilishi\n• Membrana funksiyalari\n• Yadro va DNK" },
    { from: "bot", text: "👇 Flashcard yoki test tanlang!\n\n🃏 Flashcard  📋 Test  💬 Chat" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < messages.length - 1 ? s + 1 : 0));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl shadow-indigo-500/20">
        <div className="bg-gray-950 rounded-[2rem] overflow-hidden">
          <div className="bg-[#1a1a2e] px-5 py-2 flex items-center justify-between text-[10px] text-gray-400">
            <span>Telegram</span>
            <span className="font-medium text-white">TayyorlanAI 🤖</span>
            <span>●●●</span>
          </div>
          <div className="bg-[#0e0e1a] px-3 py-3 h-[360px] flex flex-col gap-2 overflow-hidden">
            {messages.slice(0, step + 1).map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed animate-slide-up ${
                  m.from === "user"
                    ? "self-end bg-indigo-600 text-white"
                    : "self-start bg-gray-800 text-gray-200"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
              </div>
            ))}
            {step < messages.length - 1 && (
              <div className="self-start bg-gray-800 rounded-2xl px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            )}
          </div>
          <div className="bg-[#1a1a2e] px-3 py-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-full px-3 py-1.5 text-[10px] text-gray-500">Xabar yozing...</div>
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-[10px]">▶</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 50);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

/* ─── Try it section - interactive demo ─── */
function TryItDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoTexts = [
    "Fotosintez — o'simliklar yorug'lik energiyasidan foydalanib, karbonat angidrid va suvdan organik moddalar hosil qilish jarayoni. Bu jarayon xloroplastlarda sodir bo'ladi.",
    "Nyutonning ikkinchi qonuni: Jismga ta'sir qilayotgan kuch, jism massasi va tezlanish ko'paytmasiga teng. F = m × a",
    "Iqtisodiyotda talab va taklif qonuni: narx oshsa talab kamayadi, narx tushsa talab ortadi.",
  ];

  async function handleDemo() {
    if (!input.trim()) return;
    setLoading(true);
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1500));
    setResult(
      `📚 *Xulosa tayyor!*\n\n` +
      `Bu material haqida AI xulosa, flashcard va test yaratildi.\n\n` +
      `To'liq natijani ko'rish uchun platformaga kiring yoki Telegram botdan foydalaning!`
    );
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-3">Namuna tanlang yoki o'zingiz yozing:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["🧬 Biologiya", "🔬 Fizika", "📊 Iqtisod"].map((label, i) => (
              <button
                key={i}
                onClick={() => setInput(demoTexts[i])}
                className="px-3 py-1.5 bg-white/[0.05] border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Materialingizni shu yerga yozing yoki nusxalang..."
            className="w-full h-28 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder:text-gray-600 focus:border-indigo-500/50 focus:outline-none resize-none transition-all"
          />
        </div>
        
        {!result ? (
          <button
            onClick={handleDemo}
            disabled={!input.trim() || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI ishlayapti...
              </>
            ) : (
              <>⚡ AI bilan xulosa yaratish</>
            )}
          </button>
        ) : (
          <div>
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200">{result}</pre>
            </div>
            <div className="flex gap-3">
              <a
                href="https://t.me/tayyorAI_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium text-center transition-all text-sm"
              >
                🤖 Telegram'da to'liq sinab ko'rish
              </a>
              <Link
                href="/app"
                className="flex-1 border border-white/10 hover:border-white/20 text-gray-300 py-3 rounded-xl font-medium text-center transition-all text-sm"
              >
                🌐 Web versiyada ochish
              </Link>
            </div>
            <button onClick={() => { setResult(null); setInput(""); }} className="w-full mt-2 text-xs text-gray-600 hover:text-gray-400 transition">
              Qayta urinish ↻
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-3 max-w-6xl mx-auto">
          <span className="text-lg font-bold">🎓 TayyorlanAI</span>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm text-gray-400 hover:text-white transition hidden sm:block">Web versiya</Link>
            <a
              href="https://t.me/tayyorAI_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/30"
            >
              Boshlash →
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-5">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
        
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              O'zbek tilida ishlaydigan AI o'quv yordamchi
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Materialni yuboring.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI o'rgatadi.
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Matn, fayl yoki rasm yuboring — AI bir necha soniyada xulosa, flashcard va test yaratadi. 
              <strong className="text-gray-300"> To'liq o'zbek tilida. Bepul.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="https://t.me/tayyorAI_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram'da boshlash
              </a>
              <a
                href="#sinab-koring"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:bg-white/5"
              >
                Sinab ko'ring ↓
              </a>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <BotMockup />
          </div>
        </div>
      </section>

      {/* ── What it does ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Nima qila oladi? ⚡
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            Material yuboring — matn, rasm yoki fayl. AI qolganini qiladi.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📝", title: "Xulosa", desc: "Uzun materialni qisqartirib, asosiy fikrlarni ajratib beradi", color: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20" },
              { icon: "🃏", title: "Flashcard", desc: "Savol-javob kartochkalari yaratadi. Bilgan/bilmagan — o'zingiz baholang", color: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20" },
              { icon: "📋", title: "Test", desc: "Materialdan test savollar yaratadi. Bilimingizni tekshiring", color: "from-green-500/10 to-emerald-500/10", border: "border-green-500/20" },
              { icon: "💬", title: "AI Chat", desc: "Tushunmagan narsangizni so'rang — o'zbek tilida tushuntiradi", color: "from-orange-500/10 to-red-500/10", border: "border-orange-500/20" },
            ].map((f, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${f.color} ${f.border} border rounded-2xl p-5 hover:-translate-y-1 transition-all`}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Qanday ishlaydi? 3 qadam. ✅
          </h2>
          
          <div className="space-y-6">
            {[
              { num: "1", title: "Material yuboring", desc: "Matn yozing, rasm yuboring, PDF tashlang — qanday qulay bo'lsa shunday.", icon: "📤" },
              { num: "2", title: "AI bir necha soniyada ishlaydi", desc: "Xulosa avtomatik yaratiladi. Keyin flashcard, test yoki chat tanlang.", icon: "⚡" },
              { num: "3", title: "O'rganing va tekshiring", desc: "Flashcard bilan eslab qoling, test bilan bilimingizni tekshiring.", icon: "🎓" },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {s.icon} {s.title}
                  </h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Try it (interactive demo) ── */}
      <section id="sinab-koring" className="py-16 md:py-24 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-indigo-600/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Hoziroq sinab ko'ring 🚀
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-lg mx-auto">
            Material yozing yoki namunalardan tanlang — AI qanday ishlashini ko'ring
          </p>
          <TryItDemo />
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Foydalanuvchilar fikri 💬
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              {
                text: "To'g'risi kutganimdan ancha yaxshi, eng asosiysi tekin, ishlatishga qulay. Sodda va user friendly. Do'stlarimga albatta tavsiya qilaman!",
                name: "Aerospace Engineer",
                role: "Kelajakdagi MIT talabasi",
                emoji: "🚀",
              },
              {
                text: "All good, nothing more or less. Perfect!!!",
                name: "Bekhruz",
                role: "Foydalanuvchi",
                emoji: "👨‍💻",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-gray-300 mb-4 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-lg">{t.emoji}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400"><Counter target={73} suffix="+" /></div>
              <div className="text-sm text-gray-500">foydalanuvchi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">100%</div>
              <div className="text-sm text-gray-500">bepul</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">🇺🇿</div>
              <div className="text-sm text-gray-500">o'zbek tilida</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Imtihonga tayyormisiz? 🎓
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Material yuboring — AI xulosa, flashcard va test yaratsin. Bepul. Tez. O'zbekcha.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://t.me/tayyorAI_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/30"
              >
                🤖 Telegram Bot
              </a>
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:bg-white/5"
              >
                🌐 Web versiya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600">© 2026 TayyorlanAI 🇺🇿</span>
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
