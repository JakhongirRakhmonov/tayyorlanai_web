"use client";

export interface Material {
  id: string;
  title: string;
  text: string;
  createdAt: number;
}

const STORAGE_KEY = "tayyorlanai_materials";
const ACTIVE_KEY = "tayyorlanai_active";

export function getMaterials(): Material[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveMaterial(m: Material) {
  const all = getMaterials();
  all.unshift(m);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  localStorage.setItem(ACTIVE_KEY, m.id);
}

export function deleteMaterial(id: string) {
  const all = getMaterials().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  if (getActiveMaterialId() === id) {
    localStorage.setItem(ACTIVE_KEY, all[0]?.id || "");
  }
}

export function getActiveMaterialId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ACTIVE_KEY) || "";
}

export function setActiveMaterialId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveMaterial(): Material | null {
  const id = getActiveMaterialId();
  return getMaterials().find((m) => m.id === id) || null;
}
