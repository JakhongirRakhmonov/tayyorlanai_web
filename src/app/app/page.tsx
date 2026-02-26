"use client";
import { useState, useEffect, useRef } from "react";
import { getMaterials, saveMaterial, deleteMaterial, getActiveMaterialId, setActiveMaterialId, Material } from "@/lib/store";

export default function Dashboard() {
  const [materials, setMats] = useState<Material[]>([]);
  const [activeId, setActiveId] = useState("");
  const [tab, setTab] = useState<"text" | "file" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
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
    reload();
    setTextInput("");
    setTitle("");
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">📤 Material yuklash</h2>
        <div className="flex gap-2 mb-4">
          {(["text", "file", "image"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "text" ? "📝 Matn" : t === "file" ? "📄 Fayl" : "🖼 Rasm"}
            </button>
          ))}
        </div>

        {tab === "text" && (
          <div className="space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sarlavha (ixtiyoriy)"
              className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={6} placeholder="Materialingizni shu yerga yozing yoki joylashtiring..."
              className="w-full px-4 py-3 border rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{textInput.length}/10000</span>
              <button onClick={() => textInput && addMaterial(title, textInput.slice(0, 10000))}
                disabled={!textInput}
                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-primary-700 transition">
                Saqlash
              </button>
            </div>
          </div>
        )}

        {tab === "file" && (
          <div className="space-y-3">
            <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleFile}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100" />
            <p className="text-xs text-gray-400">PDF yoki TXT fayllarni yuklang</p>
          </div>
        )}

        {tab === "image" && (
          <div className="space-y-3">
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImage}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-accent-50 file:text-accent-700 file:font-medium hover:file:bg-accent-100" />
            <p className="text-xs text-gray-400">Rasm yuklang — AI matnni avtomatik tanib oladi (OCR)</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-primary-600">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            Yuklanmoqda...
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">📚 Materiallar ({materials.length})</h2>
        {materials.length === 0 ? (
          <p className="text-gray-400 text-sm">Hali material yo'q. Yuqoridan material yuklang.</p>
        ) : (
          <div className="space-y-2">
            {materials.map((m) => (
              <div key={m.id}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${m.id === activeId ? "bg-primary-50 border-2 border-primary-300" : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"}`}
                onClick={() => { setActiveMaterialId(m.id); setActiveId(m.id); }}>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{m.title}</div>
                  <div className="text-xs text-gray-400 truncate">{m.text.slice(0, 80)}...</div>
                  <div className="text-xs text-gray-300 mt-1">{new Date(m.createdAt).toLocaleDateString("uz")}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteMaterial(m.id); reload(); }}
                  className="ml-2 text-red-400 hover:text-red-600 text-lg">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
