"use client";

import type { Etape } from "@/types";
import { formatDate, labelStatut, isDeadlineDepassee } from "@/lib/utils";

interface SectionCardProps {
  etape: Etape;
  onClick: () => void;
  onRevenirPlanningAuto?: (id: string) => void;
  onMarquerFait?: (id: string) => void;
}

export function SectionCard({
  etape,
  onClick,
  onRevenirPlanningAuto,
  onMarquerFait,
}: SectionCardProps) {
  const enRetard = etape.statut !== "fait" && isDeadlineDepassee(etape.deadline);

  return (
    <div className="w-full min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-principal/40 hover:shadow-md active:shadow-lg">
      <button
        type="button"
        onClick={onClick}
        className="group w-full min-h-[44px] p-4 text-left focus:outline-none focus:ring-2 focus:ring-principal/30 focus:ring-inset rounded-xl sm:p-5 touch-manipulation"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-principal group-hover:underline sm:text-lg min-w-0 flex-1 pr-2">
            {etape.titre}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              etape.statut === "fait"
                ? "bg-green-100 text-green-800"
                : etape.statut === "en_cours"
                  ? "bg-principal/15 text-principal"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {labelStatut(etape.statut)}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>Échéance : {formatDate(etape.deadline)}</span>
          {etape.responsable && (
            <span className="text-gray-500">• {etape.responsable}</span>
          )}
        </div>
        {enRetard && (
          <p className="mt-2 text-sm font-medium text-alerte">
            Deadline dépassée
          </p>
        )}
        {etape.sousTaches.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {etape.sousTaches.filter((s) => s.statut === "fait").length} /{" "}
            {etape.sousTaches.length} sous-tâches
          </p>
        )}
      </button>
      {enRetard && onRevenirPlanningAuto && onMarquerFait && (
        <div
          className="flex flex-wrap gap-2 border-t border-gray-100 px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="min-h-[44px] rounded-lg bg-principal/10 px-3 py-2.5 text-xs font-medium text-principal hover:bg-principal/20 focus:outline-none focus:ring-2 focus:ring-principal/30 touch-manipulation sm:py-1.5"
          >
            Modifier la date
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRevenirPlanningAuto(etape.id);
            }}
            className="min-h-[44px] rounded-lg bg-principal/10 px-3 py-2.5 text-xs font-medium text-principal hover:bg-principal/20 focus:outline-none focus:ring-2 focus:ring-principal/30 touch-manipulation sm:py-1.5"
          >
            Revenir au planning auto
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarquerFait(etape.id);
            }}
            className="min-h-[44px] rounded-lg bg-green-100 px-3 py-2.5 text-xs font-medium text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 touch-manipulation sm:py-1.5"
          >
            Marquer comme fait
          </button>
        </div>
      )}
    </div>
  );
}
