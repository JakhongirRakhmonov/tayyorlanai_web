import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TayyorlanAI 🎓 — AI yordamchi",
  description: "O'zbek talabalari uchun AI o'quv platformasi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
