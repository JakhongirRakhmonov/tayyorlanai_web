"use client";
import { useState, useEffect, useRef } from "react";
import { getActiveMaterial } from "@/lib/store";

interface Msg { role: "user" | "ai"; text: string; }

export default function ChatPage() {
  const [material, setMaterial] = useState<any>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMaterial(getActiveMaterial()); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMsgs((p) => [...p, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material?.text || "", question: q }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMsgs((p) => [...p, { role: "ai", text: data.answer }]);
    } catch (e: any) {
      setMsgs((p) => [...p, { role: "ai", text: "❌ Xatolik: " + e.message }]);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl p-4 shadow-sm border-x border-t dark:border-gray-800">
        <h2 className="text-lg font-semibold">💬 AI Chat</h2>
        <p className="text-xs text-gray-400">
          {material ? `Material: ${material.title}` : "Material tanlanmagan — umumiy savol berish mumkin"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 border-x dark:border-gray-800 px-4 py-4 space-y-3">
        {msgs.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
            <p className="text-3xl mb-2">💬</p>
            <p>Savolingizni yozing!</p>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
              m.role === "user" ? "bg-primary-600 text-white rounded-br-md" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-b-2xl p-3 border dark:border-gray-800 shadow-sm flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Savolingizni yozing..."
          className="flex-1 px-4 py-2.5 border dark:border-gray-700 rounded-xl text-sm dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        <button onClick={send} disabled={!input.trim() || loading}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-primary-700 transition">
          ➤
        </button>
      </div>
    </div>
  );
}
