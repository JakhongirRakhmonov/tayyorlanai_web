"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMaterials, saveMaterial, deleteMaterial, getActiveMaterialId, setActiveMaterialId, Material } from "@/lib/store";

const tools = [
  { href: "/app/summary", icon: "📝", label: "Xulosa", desc: "AI xulosa yaratish", color: "from-blue-500 to-indigo-600" },
  { href: "/app/flashcards", icon: "🃏", label: "Flashcardlar", desc: "Kartochkalar bilan o'rganish", color: "from-purple-500 to-pink-600" },
  { href: "/app/quiz", icon: "📋", label: "Test", desc: "Bilimni tekshirish", color: "from-green-500 to-emerald-600" },
  { href: "/app/chat", icon: "💬", label: "AI Chat", desc: "Savol-javob", color: "from-orange-500 to-red-500" },
];

const uploadTypes = [
  { key: "text" as const, icon: "📝", title: "Matn yozing", desc: "Materialingizni yozing yoki joylashtiring", color: "from-blue-500 to-indigo-600" },
  { key: "file" as const, icon: "📄", title: "Fayl yuklang", desc: "PDF yoki TXT faylni tanlang", color: "from-purple-500 to-pink-600" },
  { key: "image" as const, icon: "🖼", title: "Rasm yuklang", desc: "Rasm — AI matnni tanib oladi (OCR)", color: "from-teal-500 to-cyan-600" },
];

export default function Dashboard() {
  const router = useRouter();
  const [materials, setMats] = useState<Material[]>([]);
  const [activeId, setActiveId] = useState("");
  const [activeUpload, setActiveUpload] = useState<"text" | "file" | "image" | null>(null);
  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { reload(); }, []);

  function reload() {
    setMats(getMaterials());
    setActiveId(getActiveMaterialId());
  }

  function addMaterial(title: string, text: string) {
    const m: Material = { id: Date.now().toString(), title: title || "Material", text, createdAt: Date.now() };
    saveMaterial(m);
    setActiveMaterialId(m.id);
    reload();
    setTextInput("");
    setTitle("");
    setActiveUpload(null);
    setShowSuccess(true);
  }

  async function handleFile() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      addMaterial(file.name, data.text);
    } catch (e: any) { alert("Xatolik: " + e.message); }
    setLoading(false);
  }

  async function handleImage() {
    const file = imgRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        addMaterial(file.name, data.text);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (e: any) { alert("Xatolik: " + e.message); setLoading(false); }
  }

  const activeMaterial = materials.find(m => m.id === activeId);

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-md w-full modal-content" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3 animate-scale-in">✅</div>
              <h3 className="text-xl font-bold mb-1">Material yuklandi!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Endi nima qilmoqchisiz?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tools.map((t) => (
                <button key={t.href} onClick={() => { setShowSuccess(false); router.push(t.href); }}
                  className={`bg-gradient-to-br ${t.color} text-white rounded-2xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all`}>
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-white/70 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSuccess(false)} className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition py-2">
              Yopish
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Quick tools (when material is active) - show prominently at top */}
        {activeMaterial && (
          <div className="animate-slide-up">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-5 border border-primary-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚡</span>
                <h3 className="font-semibold text-sm">Tezkor vositalar</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto truncate max-w-[150px]">📄 {activeMaterial.title}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tools.map((t) => (
                  <button key={t.href} onClick={() => router.push(t.href)}
                    className={`bg-gradient-to-br ${t.color} text-white rounded-2xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all`}>
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className="text-xs text-white/60 mt-0.5 hidden sm:block">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload section - cards */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border dark:border-gray-800 animate-slide-up delay-100">
          <h2 className="text-lg font-semibold mb-1">📤 Material yuklash</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Quyidagilardan birini tanlang</p>

          {!activeUpload ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {uploadTypes.map((u) => (
                <button key={u.key} onClick={() => {
                  setActiveUpload(u.key);
                  if (u.key === "file") setTimeout(() => fileRef.current?.click(), 100);
                  if (u.key === "image") setTimeout(() => imgRef.current?.click(), 100);
                }}
                  className={`group text-left p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${u.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="text-3xl mb-2">{u.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 dark:text-white">{u.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{u.desc}</p>
                </button>
              ))}
            </div>
          ) : activeUpload === "text" ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">📝 Matn kiritish</span>
                <button onClick={() => setActiveUpload(null)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">← Ortga</button>
              </div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sarlavha (ixtiyoriy)"
                className="w-full px-4 py-2.5 border dark:border-gray-700 rounded-xl text-sm dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={5} placeholder="Materialingizni shu yerga yozing yoki joylashtiring..."
                className="w-full px-4 py-3 border dark:border-gray-700 rounded-xl text-sm dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{textInput.length}/10000</span>
                <button onClick={() => textInput && addMaterial(title, textInput.slice(0, 10000))}
                  disabled={!textInput}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all">
                  Saqlash ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{activeUpload === "file" ? "📄 Fayl yuklash" : "🖼 Rasm yuklash"}</span>
                <button onClick={() => setActiveUpload(null)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">← Ortga</button>
              </div>
              {activeUpload === "file" ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-300 transition">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-500 mb-3">PDF yoki TXT faylni tanlang</p>
                  <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100" />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-accent-300 transition">
                  <div className="text-4xl mb-2">🖼</div>
                  <p className="text-sm text-gray-500 mb-3">Rasm yuklang — AI matnni tanib oladi (OCR)</p>
                  <input ref={imgRef} type="file" accept="image/*" onChange={handleImage}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-accent-50 file:text-accent-700 file:font-medium hover:file:bg-accent-100" />
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-600 bg-primary-50 rounded-xl p-4">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          )}
          {/* Hidden inputs for when cards trigger file selection */}
          <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile} className="hidden" />
          <input ref={imgRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </div>

        {/* Material History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border dark:border-gray-800 animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">📚 Tarix <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({materials.length} ta material)</span></h2>
            {materials.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">Tanlash uchun bosing</span>
            )}
          </div>
          {materials.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3 animate-float">📂</div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Hali material yo&apos;q</p>
              <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Yuqoridan material yuklang — bu yerda saqlanadi</p>
            </div>
          ) : (
            <div className="space-y-2">
              {materials.map((m) => {
                const date = new Date(m.createdAt);
                const timeStr = date.toLocaleDateString("uz", { day: "numeric", month: "short" }) + " · " + date.toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${m.id === activeId ? "bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 border-2 border-primary-200 dark:border-primary-800 shadow-sm" : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"}`}
                    onClick={() => { setActiveMaterialId(m.id); setActiveId(m.id); }}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${m.id === activeId ? "bg-primary-100 dark:bg-primary-900" : "bg-gray-100 dark:bg-gray-700"}`}>
                      📄
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate dark:text-white">{m.title}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{m.text.slice(0, 60)}...</div>
                      <div className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">🕐 {timeStr} · {m.text.length} belgi</div>
                    </div>
                    {m.id === activeId && (
                      <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 px-2 py-0.5 rounded-full flex-shrink-0">FAOL</span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); if(confirm("Bu materialni o'chirmoqchimisiz?")) { deleteMaterial(m.id); reload(); }}}
                      className="ml-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition text-lg flex-shrink-0">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
