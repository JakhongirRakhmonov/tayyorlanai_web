"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Phone mockup showing the bot conversation ─── */
function BotMockup() {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "user", text: "📸", type: "photo" },
    { from: "bot", text: "⚡ Rasm o'qildi! Xulosa tayyorlanmoqda..." },
    { from: "bot", text: "📚 Matematika: Limitlar\n\n📝 Xulosa: Limit — funksiyaning ma'lum nuqtaga yaqinlashgandagi qiymati...\n\n🔑 Asosiy fikrlar:\n• Limit ta'rifi va xossalari\n• Cheksizlikdagi limitlar\n• Uzluksizlik sharti" },
    { from: "bot", text: "🃏 Flashcard 1/5\n\n❓ Limit nima?\n\n🤔 O'ylab ko'ring..." },
    { from: "bot", text: "✅ Limit — funksiyaning argument ma'lum qiymatga yaqinlashgandagi qiymati\n\n✅ Bilardim  ❌ Bilmadim" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < messages.length - 1 ? s + 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      {/* Phone frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl shadow-indigo-500/20">
        <div className="bg-gray-950 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-[#1a1a2e] px-5 py-2 flex items-center justify-between text-[10px] text-gray-400">
            <span>Telegram</span>
            <span className="font-medium text-white">TayyorlanAI</span>
            <span>🤖</span>
          </div>
          {/* Chat area */}
          <div className="bg-[#0e0e1a] px-3 py-4 h-[340px] flex flex-col gap-2 overflow-hidden">
            {messages.slice(0, step + 1).map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed animate-slide-up ${
                  m.from === "user"
                    ? "self-end bg-indigo-600 text-white"
                    : "self-start bg-gray-800 text-gray-200"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {m.type === "photo" ? (
                  <div className="flex items-center gap-1">
                    <span className="text-lg">📸</span>
                    <span className="text-[10px] opacity-70">daftar_sahifa.jpg</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
                )}
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
          {/* Input bar */}
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
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

/* ─── Main page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-3 max-w-6xl mx-auto">
          <span className="text-lg font-bold">🎓 TayyorlanAI</span>
          <a
            href="https://t.me/tayyorAI_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Boshlash →
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-5">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
        
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              O'zbekistondagi yagona AI o'quv platformasi
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Daftaringizni
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                suratga oling.
              </span>
              <br />
              <span className="text-gray-400">Qolgani bizda.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Rasm, matn yoki PDF yuboring — AI bir necha soniyada xulosa, flashcard va test yaratadi. 
              <strong className="text-gray-300"> O'zbek tilida. Bepul.</strong>
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
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:bg-white/5"
              >
                Web versiya →
              </Link>
            </div>
          </div>
          
          {/* Right: Phone mockup */}
          <div className="flex-shrink-0">
            <BotMockup />
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Tanish muammolarmi? 😤
          </h2>
          <p className="text-gray-500 text-center mb-12">Har bir o'zbek talabasi buni biladi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                emoji: "⚡",
                title: "Tez ma'ruzalar",
                desc: "Ustoz tez gapiradi, daftarga yozishga ulgurmaysiz. Uyga borganda nima haqida bo'lganini eslamaysiz.",
                color: "from-red-500/10 to-orange-500/10",
                border: "border-red-500/20",
              },
              {
                emoji: "🌍",
                title: "Tilni tushunmaydi",
                desc: "Turbo AI, NotebookLM — hammasi inglizcha. O'zbek tilidagi audioni tushunmaydi. Natija aralash til.",
                color: "from-yellow-500/10 to-amber-500/10",
                border: "border-yellow-500/20",
              },
              {
                emoji: "💸",
                title: "Qimmat ilovalar",
                desc: "Chet el ilovalari oyiga $16. O'zbek talabasi uchun bu bir oylik ovqat puli.",
                color: "from-purple-500/10 to-pink-500/10",
                border: "border-purple-500/20",
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${p.color} ${p.border} border rounded-2xl p-6 hover:-translate-y-1 transition-all`}
              >
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="py-16 md:py-24 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Yechim oddiy. Suratga oling. Tamom. 📸
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Daftaringizni, doskani yoki kitobni suratga oling. Matn yozing. PDF yuboring. AI hammasi bilan ishlaydi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📝", title: "Xulosa", desc: "Uzun materialni 30 soniyada qisqartiradi", color: "indigo" },
              { icon: "🃏", title: "Flashcard", desc: "Eslab qolish uchun kartochkalar + o'z-o'zini baholash", color: "purple" },
              { icon: "📋", title: "Test", desc: "Bilimingizni tekshirish uchun AI savollar yaratadi", color: "pink" },
              { icon: "💬", title: "AI Chat", desc: "Tushunmagan narsangizni so'rang — tushuntiradi", color: "cyan" },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            3 qadam. Shu. ✅
          </h2>
          
          <div className="space-y-6">
            {[
              { num: "1", title: "Material yuboring", desc: "Matn yozing, rasm yuboring yoki PDF tashlang. Qanday qulay bo'lsa.", icon: "📤" },
              { num: "2", title: "AI ishlaydi", desc: "3 soniya. Xulosa, flashcard va test avtomatik yaratiladi.", icon: "⚡" },
              { num: "3", title: "O'rganing", desc: "Flashcard bilan eslab qoling. Test bilan tekshiring. Chat bilan so'rang.", icon: "🎓" },
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

      {/* ── Social proof ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Talabalar aytmoqda 💬
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {/* Stats bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-16">
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

      {/* ── Why us vs competitors ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Nima uchun boshqalar emas? 🤔
          </h2>
          
          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="text-left px-4 py-3 font-medium text-gray-400"></th>
                  <th className="px-4 py-3 font-bold text-indigo-400">TayyorlanAI</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Turbo AI</th>
                  <th className="px-4 py-3 font-medium text-gray-500">NotebookLM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ["O'zbek tilida ishlaydi", "✅", "❌", "❌"],
                  ["Narxi", "Bepul", "$16/oy", "Bepul*"],
                  ["Flashcard + Test", "✅", "✅", "❌"],
                  ["Rasm o'qish", "✅", "✅", "❌"],
                  ["O'zbek talabalariga moslangan", "✅", "❌", "❌"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-gray-400">{row[0]}</td>
                    <td className="px-4 py-3 text-center font-medium">{row[1]}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{row[2]}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">* NotebookLM bepul, lekin o'zbek tilini qo'llab-quvvatlamaydi</p>
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
              Daftaringizni suratga oling. 30 soniyada xulosa, flashcard va test tayyor. Bepul.
            </p>
            <a
              href="https://t.me/tayyorAI_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Hoziroq boshlash
            </a>
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
