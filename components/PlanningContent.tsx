"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { RappelsBandeau } from "@/components/RappelsBandeau";
import { SectionCard } from "@/components/SectionCard";
import { FicheDetail } from "@/components/FicheDetail";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getEtapeById } from "@/lib/data";
import type { ProjetEditorial } from "@/types";

/** Wrapper qui isole useSearchParams pour éviter l’erreur React #310 (hooks après suspend). */
export function PlanningContent() {
  const searchParams = useSearchParams();
  return <PlanningContentInner searchParams={searchParams} />;
}

interface PlanningContentInnerProps {
  searchParams: ReturnType<typeof useSearchParams>;
}

function PlanningContentInner({ searchParams }: PlanningContentInnerProps) {
  const {
    projet,
    rappels,
    lastSavedAt,
    updateEtape,
    updateEtapeDeadline,
    updateSousTache,
    resetEtape,
    resetProjet,
    replaceProjet,
    revenirPlanningAuto,
    marquerFait,
    setDateLancement,
  } = useProject();
  const [etapeOuverte, setEtapeOuverte] = useState<string | null>(null);
  const inputImportRef = useRef<HTMLInputElement>(null);

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

  const handleExport = useCallback(() => {
    if (!projet) return;
    const blob = new Blob([JSON.stringify(projet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projet-editorial-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projet]);

  const handleImport = useCallback(() => {
    inputImportRef.current?.click();
  }, []);

  const onImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !replaceProjet) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as ProjetEditorial;
          if (!data || !Array.isArray(data.etapes) || data.etapes.length === 0) {
            alert("Fichier invalide : structure de projet attendue.");
            return;
          }
          if (
            !window.confirm(
              "Remplacer l’état actuel du projet par ce fichier ? Les données actuelles seront perdues."
            )
          )
            return;
          replaceProjet({ ...data, derniereModif: new Date().toISOString() });
        } catch {
          alert("Fichier JSON invalide.");
        }
      };
      reader.readAsText(file);
    },
    [replaceProjet]
  );

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

  const hasEtapes = Array.isArray(projet.etapes) && projet.etapes.length > 0;

  return (
    <div className="min-h-screen bg-fond">
      <input
        ref={inputImportRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={onImportFile}
      />
      <header className="border-b border-principal/20 bg-amber-50 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
          <Breadcrumb items={[{ label: "Planning" }]} />
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
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
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExport}
                className="min-h-[44px] rounded-lg border border-principal/40 bg-white px-3 py-2 text-sm font-medium text-principal hover:bg-principal/5 focus:outline-none focus:ring-2 focus:ring-principal/30"
              >
                Exporter
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-principal/30"
              >
                Importer
              </button>
              <button
                type="button"
                onClick={handleResetProjet}
                className="min-h-[44px] shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-principal/30 active:bg-gray-100 sm:py-2"
              >
                Réinitialiser le projet
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {!hasEtapes && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Données introuvables. Utilisez Importer pour charger une sauvegarde ou Réinitialiser le projet.
          </p>
        )}
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
            {hasEtapes && projet.etapes.map((etape) => (
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
