import type { Etape, Rappel } from "@/types";

const JOUR_MS = 24 * 60 * 60 * 1000;
const JOURS_AVANT_RAPPEL = 3;

export function getRappels(etapes: Etape[]): Rappel[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const rappels: Rappel[] = [];

  for (const etape of etapes) {
    if (etape.statut === "fait") continue;
    const deadlineTime = new Date(etape.deadline).getTime();
    const deadlineDate = new Date(etape.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const deadlineStart = deadlineDate.getTime();

    if (deadlineStart < today) {
      rappels.push({
        type: "alerte",
        etapeId: etape.id,
        etapeTitre: etape.titre,
        deadline: etape.deadline,
        message: `Deadline dépassée le ${formatDate(etape.deadline)} – statut : ${labelStatut(etape.statut)}`,
      });
    } else {
      const joursRestants = Math.ceil((deadlineStart - today) / JOUR_MS);
      if (joursRestants <= JOURS_AVANT_RAPPEL) {
        rappels.push({
          type: "rappel",
          etapeId: etape.id,
          etapeTitre: etape.titre,
          deadline: etape.deadline,
          message: `Rappel : deadline le ${formatDate(etape.deadline)} (dans ${joursRestants} jour${joursRestants > 1 ? "s" : ""})`,
        });
      }
    }
  }

  return rappels.sort((a, b) => a.deadline.localeCompare(b.deadline));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function labelStatut(s: Etape["statut"]): string {
  switch (s) {
    case "a_faire": return "À faire";
    case "en_cours": return "En cours";
    case "fait": return "Fait";
    default: return s;
  }
}
