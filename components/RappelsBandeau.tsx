"use client";

import type { Rappel } from "@/types";

interface RappelsBandeauProps {
  rappels: Rappel[];
  onEtapeClick?: (etapeId: string) => void;
}

export function RappelsBandeau({ rappels, onEtapeClick }: RappelsBandeauProps) {
  if (rappels.length === 0) return null;

  return (
    <div className="rounded-lg border border-alerte/30 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-alerte">
        Rappels & alertes
      </h3>
      <ul className="space-y-2">
        {rappels.map((r) => (
          <li key={`${r.etapeId}-${r.deadline}`}>
            <button
              type="button"
              onClick={() => onEtapeClick?.(r.etapeId)}
              className={`min-h-[44px] w-full rounded px-3 py-3 text-left text-sm transition hover:opacity-90 touch-manipulation sm:py-2 ${
                r.type === "alerte"
                  ? "bg-alerte/10 text-alerte"
                  : "bg-principal/10 text-principal"
              }`}
            >
              <span className="font-medium">{r.etapeTitre}</span>
              <span className="ml-2 opacity-90">– {r.message}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
