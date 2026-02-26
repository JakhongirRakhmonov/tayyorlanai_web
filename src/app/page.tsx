"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ThemeToggle from "./components/ThemeToggle";

const features = [
  { icon: "📝", title: "Xulosa", desc: "Materiallaringizdan AI yordamida qisqacha xulosa oling", color: "from-blue-500 to-indigo-600" },
  { icon: "🃏", title: "Flashcardlar", desc: "Savol-javob kartochkalari bilan o'rganing", color: "from-purple-500 to-pink-600" },
  { icon: "📋", title: "Test", desc: "Bilimingizni AI yaratgan testlar bilan tekshiring", color: "from-green-500 to-emerald-600" },
  { icon: "💬", title: "AI Chat", desc: "Material bo'yicha savollar bering va javob oling", color: "from-orange-500 to-red-500" },
  { icon: "📄", title: "PDF & Rasm", desc: "PDF, matn yoki rasm yuklang — AI tahlil qiladi", color: "from-cyan-500 to-blue-600" },
  { icon: "⚡", title: "Tezkor", desc: "Bir necha soniyada natija — Groq AI tezligi bilan", color: "from-yellow-500 to-orange-500" },
];

const steps = [
  { num: "01", icon: "📤", title: "Materialni yuklang", desc: "Matn, PDF yoki rasm — xohlagan formatda" },
  { num: "02", icon: "🤖", title: "AI qayta ishlaydi", desc: "Sun'iy intellekt materialingizni tahlil qiladi" },
  { num: "03", icon: "🎯", title: "O'rganing", desc: "Xulosa, kartochkalar, testlar va chat tayyor!" },
];

const stats = [
  { value: "73+", label: "Foydalanuvchilar", icon: "👥" },
  { value: "500+", label: "Materiallar", icon: "📚" },
  { value: "3 soniya", label: "O'rtacha tezlik", icon: "⚡" },
  { value: "100%", label: "Bepul", icon: "🎁" },
];

const testimonials = [
  { name: "Aziza", role: "2-kurs talabasi", text: "Imtihonga 2 kunda tayyorlandim. Flashcardlar juda foydali bo'ldi!", avatar: "👩‍🎓" },
  { name: "Sardor", role: "Biologiya fakulteti", text: "AI test yaratish funksiyasi ajoyib. Vaqtimni tejadi!", avatar: "👨‍💻" },
  { name: "Nilufar", role: "Tibbiyot talabasi", text: "Xulosa funksiyasi bilan 50 sahifani 1 daqiqada o'rganaman!", avatar: "👩‍⚕️" },
];

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach(el => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="flex items-center justify-between px-5 py-3 max-w-6xl mx-auto">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            🎓 TayyorlanAI
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/app" className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all">
              Boshlash →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,0,0.08),transparent_40%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-slide-up inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            🚀 O&apos;zbek talabalari uchun #1 AI platforma
          </div>
          <h1 className="animate-slide-up delay-100 text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            AI bilan o&apos;qishni
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">osonlashtiring</span>
          </h1>
          <p className="animate-slide-up delay-200 text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Materiallaringizni yuklang — xulosa, flashcardlar, testlar va AI chat avtomatik yaratiladi. Imtihonlarga tayyorlaning!
          </p>
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app" className="inline-block bg-white text-primary-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all glow-btn">
              Bepul boshlash 🎓
            </Link>
            <a href="#features" className="inline-block border-2 border-white/40 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all">
              Batafsil ↓
            </a>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl" />
      </section>

      {/* Stats */}
      <section className="py-14 px-5 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="animate-on-scroll opacity-0 translate-y-4 text-center bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-5 border border-primary-100 hover:shadow-lg transition-all"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="animate-on-scroll opacity-0 translate-y-4 text-3xl md:text-4xl font-bold text-center mb-4">
            Nima qila olasiz? 🎯
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Bitta platforma — barcha kerakli vositalar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="animate-on-scroll opacity-0 translate-y-4 group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="animate-on-scroll opacity-0 translate-y-4 text-3xl md:text-4xl font-bold text-center mb-4">
            Qanday ishlaydi? 🛠
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 text-gray-500 text-center mb-12">3 oddiy qadam — va tayyor!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="animate-on-scroll opacity-0 translate-y-4 text-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100"
                style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 500}ms` }}>{s.icon}</div>
                <div className="text-xs font-bold text-primary-400 mb-2">QADAM {s.num}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
                {i < 2 && <div className="hidden md:block text-3xl text-primary-200 mt-4">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="animate-on-scroll opacity-0 translate-y-4 text-3xl md:text-4xl font-bold text-center mb-4">
            Talabalar nima deydi? 💬
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 text-gray-500 text-center mb-12">Haqiqiy foydalanuvchilar fikrlari</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="animate-on-scroll opacity-0 translate-y-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-gray-600 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="py-16 px-5 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Telegram botimiz ham bor!
          </h2>
          <p className="text-gray-500 mb-8 text-lg max-w-xl mx-auto">
            Telegramda ham foydalaning — material yuboring, xulosa, flashcard va testlarni to&apos;g&apos;ridan-to&apos;g&apos;ri chatda oling!
          </p>
          <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#0088cc] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram Bot →
          </a>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hoziroq boshlang! 🚀
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Ro&apos;yxatdan o&apos;tish shart emas. Material yuklang va AI ishlaydi.
            </p>
            <Link href="/app" className="inline-block bg-white text-primary-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all">
              Bepul boshlash →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 pt-16 pb-8 px-5 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="text-2xl font-bold">🎓 TayyorlanAI</span>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
                O&apos;zbek talabalari uchun maxsus yaratilgan AI o&apos;quv platformasi. Imtihonlarga tayyorlaning, bilimingizni tekshiring va yangi narsalarni o&apos;rganing.
              </p>
            </div>

            {/* Platforma */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Platforma</h4>
              <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                <Link href="/app" className="hover:text-white transition">📤 Material yuklash</Link>
                <Link href="/app/summary" className="hover:text-white transition">📝 Xulosa</Link>
                <Link href="/app/flashcards" className="hover:text-white transition">🃏 Flashcardlar</Link>
                <Link href="/app/quiz" className="hover:text-white transition">📋 Testlar</Link>
                <Link href="/app/chat" className="hover:text-white transition">💬 AI Chat</Link>
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Bog&apos;lanish</h4>
              <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                <a href="https://t.me/tayyorAI_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🤖 Telegram Bot</a>
                <a href="https://t.me/Developer_John" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">💬 Telegram</a>
                <a href="https://www.instagram.com/jahongir_rahmonov" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📸 Instagram</a>
                <a href="https://linktr.ee/Jahongir_Rahmonov" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🔗 Barcha havolalar</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">© 2026 TayyorlanAI — O&apos;zbekiston 🇺🇿</p>
            <p className="text-xs text-gray-600">O&apos;zbek talabalari uchun yaratilgan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
