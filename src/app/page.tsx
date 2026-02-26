import Link from "next/link";

const features = [
  { icon: "📝", title: "Xulosa", desc: "Materiallaringizdan AI yordamida qisqacha xulosa oling" },
  { icon: "🃏", title: "Flashcardlar", desc: "Savol-javob kartochkalari bilan o'rganing" },
  { icon: "📋", title: "Test", desc: "Bilimingizni AI yaratgan testlar bilan tekshiring" },
  { icon: "💬", title: "AI Chat", desc: "Material bo'yicha savollar bering va javob oling" },
  { icon: "📄", title: "PDF & Rasm", desc: "PDF, matn yoki rasm yuklang — AI tahlil qiladi" },
  { icon: "⚡", title: "Tezkor", desc: "Bir necha soniyada natija — Groq AI tezligi bilan" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          🎓 TayyorlanAI
        </span>
        <Link href="/app" className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition">
          Boshlash →
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-6">
          🚀 O'zbek talabalari uchun AI platforma
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 via-accent-600 to-primary-600 bg-clip-text text-transparent leading-tight">
          AI bilan o'qishni osonlashtiring
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Materiallaringizni yuklang — xulosa, flashcardlar, testlar va AI chat avtomatik yaratiladi. Imtihonlarga tayyorlaning!
        </p>
        <Link href="/app" className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all">
          Bepul boshlash 🎓
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 pb-8">
        © 2026 TayyorlanAI. O'zbek talabalari uchun yaratilgan ❤️
      </footer>
    </div>
  );
}
