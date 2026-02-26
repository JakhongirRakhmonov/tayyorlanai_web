"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app", label: "📂 Material", exact: true },
  { href: "/app/summary", label: "📝 Xulosa" },
  { href: "/app/flashcards", label: "🃏 Kartalar" },
  { href: "/app/quiz", label: "📋 Test" },
  { href: "/app/chat", label: "💬 Chat" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            🎓 TayyorlanAI
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-2 pb-2 flex gap-1 overflow-x-auto scrollbar-none">
          {nav.map((n) => {
            const active = n.exact ? path === n.href : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${active ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {n.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
