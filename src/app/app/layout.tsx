"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveMaterial } from "@/lib/store";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const nav: { href: string; label: string; title: string; exact?: boolean; isNew?: boolean }[] = [
  { href: "/app", label: "📂", title: "Material", exact: true },
  { href: "/app/summary", label: "📝", title: "Xulosa" },
  { href: "/app/flashcards", label: "🃏", title: "Kartalar" },
  { href: "/app/quiz", label: "📋", title: "Test" },
  { href: "/app/chat", label: "💬", title: "Chat" },
  { href: "/app/youtube", label: "▶️", title: "YouTube", isNew: true },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [materialName, setMaterialName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const m = getActiveMaterial();
    setMaterialName(m?.title || "");
  }, [path]);

  // Protect routes — redirect to /auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isSubPage = path !== "/app";

  // User info
  const userAvatar = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name;
  const userEmail = user.email;
  const userInitial = (userName?.[0] || userEmail?.[0] || "?").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
      {/* Top header */}
      <header className="glass border-b dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {isSubPage && (
            <Link href="/app" className="text-gray-400 hover:text-gray-600 transition text-lg">
              ←
            </Link>
          )}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            🎓 TayyorlanAI
          </Link>
          <div className="flex-1" />
          {materialName && (
            <div className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full truncate max-w-[200px]">
              📄 {materialName}
            </div>
          )}
          <ThemeToggle />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full pl-1 pr-3 py-1 transition"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  className="w-7 h-7 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {userInitial}
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-300 hidden sm:block max-w-[100px] truncate">
                {userName || userEmail}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b dark:border-gray-800">
                    {userName && (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{userName}</p>
                    )}
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition flex items-center gap-2"
                  >
                    🚪 Chiqish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex max-w-4xl mx-auto px-2 pb-2 gap-1">
          {nav.map((n) => {
            const active = n.exact ? path === n.href : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`relative px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition font-medium ${active ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                {n.label} {n.title}
                {n.isNew && (
                  <span className="absolute -top-1.5 -right-1 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                    YANGI
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Mobile material indicator */}
      {materialName && (
        <div className="md:hidden px-4 pt-3">
          <div className="text-xs text-gray-400 bg-white dark:bg-gray-900 px-3 py-2 rounded-xl border dark:border-gray-800 truncate">
            📄 Tanlangan: <span className="font-medium text-gray-600 dark:text-gray-300">{materialName}</span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-4 animate-fade-in">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t dark:border-gray-800 z-50 safe-area-bottom">
        <div className="flex justify-around py-2 px-2">
          {nav.map((n) => {
            const active = n.exact ? path === n.href : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? "text-primary-600" : "text-gray-400"}`}>
                <span className={`text-xl ${active ? "scale-110" : ""} transition-transform`}>{n.label}</span>
                <span className="text-[10px] font-medium">{n.title}</span>
                {n.isNew && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
