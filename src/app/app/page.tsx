"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  { key: "youtube" as const, icon: "▶️", title: "YouTube video", desc: "Video subtitridan xulosa yaratish", color: "from-red-500 to-rose-600" },
];

export default function Dashboard() {
  const router = useRouter();
  const [materials, setMats] = useState<Material[]>([]);
  const [activeId, setActiveId] = useState("");
  const [activeUpload, setActiveUpload] = useState<"text" | "file" | "image" | "youtube" | null>(null);
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
        {/* Quick tools (when material is active) */}
        {activeMaterial && (
          <div className="animate-slide-up">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚡</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Tezkor vositalar</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto truncate max-w-[180px] bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">📄 {activeMaterial.title}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tools.map((t) => (
                  <button key={t.href} onClick={() => router.push(t.href)}
                    className="group relative bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 rounded-2xl p-4 text-center border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xl mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-200`}>
                      {t.icon}
                    </div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{t.label}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload section - Modern redesign */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-slide-up delay-100 overflow-hidden">
          {!activeUpload ? (
            <div className="p-6 md:p-8">
              {/* Main dropzone area */}
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 md:p-14 text-center mb-6 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-300 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Material yuklang</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">Matn, fayl yoki rasm — quyidagilardan birini tanlang</p>
              </div>

              {/* Upload type buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {uploadTypes.map((u) => (
                  u.key === "youtube" ? (
                    <Link key={u.key} href="/app/youtube"
                      className="group flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{u.icon}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">YouTube</span>
                    </Link>
                  ) : (
                    <button key={u.key} onClick={() => {
                      setActiveUpload(u.key);
                      if (u.key === "file") setTimeout(() => fileRef.current?.click(), 100);
                      if (u.key === "image") setTimeout(() => imgRef.current?.click(), 100);
                    }}
                      className="group flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{u.icon}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{u.key === "text" ? "Matn" : u.key === "file" ? "Fayl" : "Rasm"}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          ) : activeUpload === "text" ? (
            <div className="p-6 md:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg">📝</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Matn kiritish</h3>
                </div>
                <button onClick={() => setActiveUpload(null)} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Ortga
                </button>
              </div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sarlavha (ixtiyoriy)"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition mb-3 placeholder:text-gray-300 dark:placeholder:text-gray-600" />
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={8} placeholder="Materialingizni shu yerga yozing yoki joylashtiring..."
                className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-300 dark:placeholder:text-gray-600 leading-relaxed" />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-300 dark:text-gray-600 font-mono">{textInput.length.toLocaleString()} / 10,000</span>
                <button onClick={() => textInput && addMaterial(title, textInput.slice(0, 10000))}
                  disabled={!textInput}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-40 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  Saqlash
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeUpload === "file" ? "from-purple-500 to-pink-600" : "from-teal-500 to-cyan-600"} flex items-center justify-center text-white text-lg`}>
                    {activeUpload === "file" ? "📄" : "🖼"}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{activeUpload === "file" ? "Fayl yuklash" : "Rasm yuklash"}</h3>
                </div>
                <button onClick={() => setActiveUpload(null)} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Ortga
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 md:p-14 text-center hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-300 bg-gray-50/50 dark:bg-gray-800/30">
                {activeUpload === "file" ? (
                  <>
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center">
                      <svg className="w-7 h-7 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">Faylni tanlang yoki shu yerga tashlang</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">PDF yoki TXT formatda</p>
                    <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile}
                      className="w-full max-w-xs mx-auto text-sm file:mr-3 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-300 file:font-semibold file:cursor-pointer hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 transition" />
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 flex items-center justify-center">
                      <svg className="w-7 h-7 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">Rasmni tanlang yoki shu yerga tashlang</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">AI matnni tanib oladi (OCR)</p>
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImage}
                      className="w-full max-w-xs mx-auto text-sm file:mr-3 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-teal-50 dark:file:bg-teal-900/30 file:text-teal-700 dark:file:text-teal-300 file:font-semibold file:cursor-pointer hover:file:bg-teal-100 dark:hover:file:bg-teal-900/50 transition" />
                  </>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="mx-6 mb-6 flex items-center justify-center gap-3 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900">
              <div className="w-5 h-5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          )}
          {/* Hidden inputs for file selection */}
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
