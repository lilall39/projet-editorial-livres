import type { ProjetEditorial } from "@/types";
import { getDonneesInitiales } from "./data";

const STORAGE_KEY = "projet-editorial-livres";

export function loadProjet(): ProjetEditorial {
  if (typeof window === "undefined") return getDonneesInitiales();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDonneesInitiales();
    const parsed = JSON.parse(raw) as ProjetEditorial;
    if (!parsed.etapes?.length) return getDonneesInitiales();
    return parsed;
  } catch {
    return getDonneesInitiales();
  }
}

export function saveProjet(projet: ProjetEditorial): void {
  const toSave = {
    ...projet,
    derniereModif: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
}
