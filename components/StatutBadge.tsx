"use client";

import type { Statut } from "@/types";
import { labelStatut } from "@/lib/utils";

interface StatutBadgeProps {
  statut: Statut;
  enRetard?: boolean;
  /** Affichage compact (icône seule sur les cartes) */
  compact?: boolean;
}

export function StatutBadge({ statut, enRetard = false, compact = false }: StatutBadgeProps) {
  if (enRetard) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-alerte/15 px-2.5 py-1 text-xs font-medium text-alerte"
        title="En retard"
      >
        {compact ? "⛔" : "⛔ En retard"}
      </span>
    );
  }

  switch (statut) {
    case "fait":
      return (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-white px-2.5 py-1 text-xs font-medium text-green-800"
          title={labelStatut(statut)}
        >
          {compact ? "✔️" : "✔️ Fait"}
        </span>
      );
    case "en_cours":
      return (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-principal/10 px-2.5 py-1 text-xs font-medium text-principal"
          title={labelStatut(statut)}
        >
          {compact ? "⏳" : "⏳ En cours"}
        </span>
      );
    case "a_faire":
    default:
      return (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-principal/20 px-2.5 py-1 text-xs font-medium text-principal"
          title={labelStatut(statut)}
        >
          {compact ? "○" : "À faire"}
        </span>
      );
  }
}
