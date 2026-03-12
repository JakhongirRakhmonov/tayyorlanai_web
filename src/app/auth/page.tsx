"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/app");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            setError("Email yoki parol noto'g'ri");
          } else {
            setError(error.message);
          }
        } else {
          router.push("/app");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            setError("Bu email allaqachon ro'yxatdan o'tgan");
          } else if (error.message.includes("Password")) {
            setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
          } else {
            setError(error.message);
          }
        } else {
          setMessage("Tasdiqlash havolasi emailingizga yuborildi. Emailni tekshiring!");
        }
      }
    } catch {
      setError("Kutilmagan xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Google bilan kirishda xatolik");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-5 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-lg font-bold tracking-tight">
            🎓 TayyorlanAI
          </Link>
        </div>
      </nav>

      {/* Auth form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Xush kelibsiz! 👋" : "Ro'yxatdan o'ting 🎓"}
            </h1>
            <p className="text-gray-400">
              {mode === "login"
                ? "Hisobingizga kiring va o'rganishni davom eting"
                : "Yangi hisob yarating va AI bilan o'rganishni boshlang"}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3.5 rounded-xl transition-all hover:shadow-lg mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan kirish
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-gray-500">yoki</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Parol</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  required
                  minLength={6}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-400">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kutilmoqda...
                  </>
                ) : mode === "login" ? (
                  "Kirish"
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center text-sm text-gray-500">
              {mode === "login" ? (
                <>
                  Hisobingiz yo'qmi?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition"
                  >
                    Ro'yxatdan o'ting
                  </button>
                </>
              ) : (
                <>
                  Hisobingiz bormi?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition"
                  >
                    Kirish
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Back to landing */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-400 transition">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
