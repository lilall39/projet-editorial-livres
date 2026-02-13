"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { RappelsBandeau } from "@/components/RappelsBandeau";
import { SectionCard } from "@/components/SectionCard";
import { FicheDetail } from "@/components/FicheDetail";
import { getEtapeById } from "@/lib/data";

export function PlanningContent() {
  const searchParams = useSearchParams();
  const {
    projet,
    rappels,
    lastSavedAt,
    updateEtape,
    updateEtapeDeadline,
    updateSousTache,
    resetEtape,
    resetProjet,
    revenirPlanningAuto,
    marquerFait,
    setDateLancement,
  } = useProject();
  const [etapeOuverte, setEtapeOuverte] = useState<string | null>(null);

  useEffect(() => {
    const etapeFromUrl = searchParams.get("etape");
    if (etapeFromUrl) setEtapeOuverte(etapeFromUrl);
  }, [searchParams]);

  const ouvrirFiche = useCallback((id: string) => setEtapeOuverte(id), []);
  const fermerFiche = useCallback(() => setEtapeOuverte(null), []);

  const handleResetProjet = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Réinitialiser tout le projet ? Toutes les étapes seront remises aux valeurs par défaut (structure conservée). Cette action est irréversible."
      )
    )
      return;
    resetProjet();
    fermerFiche();
  }, [fermerFiche, resetProjet]);

  if (!projet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-fond">
        <p className="text-gray-500">Chargement…</p>
      </div>
    );
  }

  const etapeDetail = etapeOuverte
    ? getEtapeById(projet.etapes, etapeOuverte)
    : null;

  return (
    <div className="min-h-screen bg-fond">
      <header className="border-b border-principal/20 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-principal sm:text-2xl">
                {projet.nom}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Planning global – une page pour piloter le projet de A à Z
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <div>
                  <label className="mr-2 block text-xs text-gray-500 sm:inline">Date de lancement</label>
                  <input
                    type="date"
                    value={projet.dateLancement ?? ""}
                    onChange={(e) => setDateLancement(e.target.value || undefined)}
                    className="mt-1 min-h-[44px] rounded border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal sm:mt-0 sm:min-h-0 sm:py-1"
                  />
                </div>
                {lastSavedAt && (
                  <span className="text-xs text-gray-500" title={lastSavedAt.toLocaleTimeString("fr-FR")}>
                    Enregistré
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetProjet}
              className="min-h-[44px] shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-principal/30 active:bg-gray-100 sm:py-2"
            >
              Réinitialiser le projet
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {rappels.length > 0 && (
          <section className="mb-8">
            <RappelsBandeau
              rappels={rappels}
              onEtapeClick={(id) => ouvrirFiche(id)}
            />
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-semibold text-principal">
            Étapes du projet
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {projet.etapes.map((etape) => (
              <SectionCard
                key={etape.id}
                etape={etape}
                onClick={() => ouvrirFiche(etape.id)}
                onRevenirPlanningAuto={revenirPlanningAuto}
                onMarquerFait={marquerFait}
              />
            ))}
          </div>
        </section>
      </main>

      {etapeDetail && (
        <FicheDetail
          etape={etapeDetail}
          onClose={fermerFiche}
          onUpdate={updateEtape}
          onUpdateEtapeDeadline={updateEtapeDeadline}
          onUpdateSousTache={updateSousTache}
          onResetEtape={resetEtape}
          onRevenirPlanningAuto={revenirPlanningAuto}
          onMarquerFait={marquerFait}
        />
      )}
    </div>
  );
}
