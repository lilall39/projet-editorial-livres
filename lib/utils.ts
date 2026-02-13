import type { Statut } from "@/types";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function labelStatut(s: Statut): string {
  switch (s) {
    case "a_faire":
      return "À faire";
    case "en_cours":
      return "En cours";
    case "fait":
      return "Fait";
    default:
      return String(s);
  }
}

export function isDeadlineDepassee(deadline: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

/** Jours restants (positif) ou jours de retard (négatif). */
export function joursRestants(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}
