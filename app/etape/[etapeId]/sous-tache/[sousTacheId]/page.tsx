"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { getEtapeById, getSousTache } from "@/lib/data";
import { labelStatut } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatutBadge } from "@/components/StatutBadge";
import type { Statut } from "@/types";

const STATUTS: Statut[] = ["a_faire", "en_cours", "fait"];

function safeParam(p: string | string[] | undefined): string {
  if (p == null) return "";
  return Array.isArray(p) ? p[0] ?? "" : p;
}

export default function FicheSousTachePage() {
  const params = useParams() ?? {};
  const router = useRouter();
  const etapeId = safeParam(params.etapeId);
  const sousTacheId = safeParam(params.sousTacheId);
  const { projet, updateSousTacheDetail } = useProject();
  const [objectifAFaire, setObjectifAFaire] = useState("");
  const [ceQuiAFait, setCeQuiAFait] = useState("");
  const [responsable, setResponsable] = useState("");
  const [notes, setNotes] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const etape =
    projet?.etapes && etapeId ? getEtapeById(projet.etapes, etapeId) : undefined;
  const sousTache =
    etape && projet && sousTacheId
      ? getSousTache(projet.etapes, etapeId, sousTacheId)
      : undefined;

  useEffect(() => {
    if (sousTache) {
      setObjectifAFaire(sousTache.objectifAFaire ?? "");
      setCeQuiAFait(sousTache.ceQuiAFait ?? "");
      setResponsable(sousTache.responsable ?? "");
      setNotes(sousTache.notes ?? "");
    }
  }, [sousTache?.id, sousTache?.objectifAFaire, sousTache?.ceQuiAFait, sousTache?.responsable, sousTache?.notes]);

  const save = useCallback(
    (patch: Parameters<typeof updateSousTacheDetail>[2]) => {
      if (etapeId && sousTacheId) updateSousTacheDetail(etapeId, sousTacheId, patch);
    },
    [etapeId, sousTacheId, updateSousTacheDetail]
  );

  const liens = sousTache?.liens ?? [];

  const addLink = useCallback(() => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim() || !etapeId || !sousTacheId) return;
    const next = [...liens, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }];
    updateSousTacheDetail(etapeId, sousTacheId, { liens: next });
    setNewLinkLabel("");
    setNewLinkUrl("");
  }, [etapeId, sousTacheId, liens, newLinkLabel, newLinkUrl, updateSousTacheDetail]);

  const removeLink = useCallback(
    (index: number) => {
      if (!etapeId || !sousTacheId) return;
      const next = liens.filter((_, i) => i !== index);
      updateSousTacheDetail(etapeId, sousTacheId, { liens: next });
    },
    [etapeId, sousTacheId, liens, updateSousTacheDetail]
  );

  const handleSauvegarderEtRetour = useCallback(() => {
    save({ objectifAFaire, ceQuiAFait, responsable, notes });
    router.push("/");
  }, [objectifAFaire, ceQuiAFait, responsable, notes, save, router]);

  if (!projet) {
    return (
      <div className="min-h-screen bg-fond p-8">
        <p className="text-gray-500">Chargement…</p>
        <Link href="/" className="mt-4 inline-block text-sm text-principal hover:underline">
          Retour au planning global
        </Link>
      </div>
    );
  }

  if (!etapeId || !sousTacheId || !etape || !sousTache) {
    return (
      <div className="min-h-screen bg-fond p-8">
        <Breadcrumb items={[{ label: "Planning", href: "/" }]} />
        <p className="mt-4 text-gray-500">
          {!etapeId || !sousTacheId
            ? "URL incomplète."
            : "Données introuvables pour cette étape ou sous-tâche."}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-principal hover:underline">
          Retour au planning global
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fond">
      <header className="border-b border-principal/20 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Planning", href: "/" },
              { label: etape.titre, href: `/?etape=${etapeId}` },
              { label: sousTache.libelle },
            ]}
          />
          <h1 className="mt-3 text-lg font-bold text-principal min-w-0 break-words sm:text-xl">
            {sousTache.libelle}
          </h1>
          <p className="text-sm text-gray-600">{etape.titre}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          <section className="rounded-2xl border border-principal/20 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-principal">Objectif / à faire</h2>
            <textarea
              value={objectifAFaire}
              onChange={(e) => setObjectifAFaire(e.target.value)}
              onBlur={() => save({ objectifAFaire })}
              rows={3}
              placeholder="Décrivez l’objectif ou ce qui est à faire…"
              className="mt-1 min-h-[100px] w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal sm:text-sm"
            />
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Ce qui a été fait</h2>
            <textarea
              value={ceQuiAFait}
              onChange={(e) => setCeQuiAFait(e.target.value)}
              onBlur={() => save({ ceQuiAFait })}
              rows={3}
              placeholder="Résumé de ce qui a été réalisé…"
              className="mt-1 min-h-[100px] w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal sm:text-sm"
            />
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 shrink-0">Statut</label>
            <select
              value={sousTache.statut}
              onChange={(e) => save({ statut: e.target.value as Statut })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {labelStatut(s)}
                </option>
              ))}
            </select>
            <StatutBadge statut={sousTache.statut} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={sousTache.deadline ?? ""}
              onChange={(e) => save({ deadline: e.target.value || undefined })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Responsable
            </label>
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              onBlur={() => save({ responsable: responsable || undefined })}
              placeholder="Ex. Jean Dupont, équipe éditoriale…"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => save({ notes: notes || undefined })}
              rows={3}
              placeholder="Notes, idées, points d’attention…"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Liens utiles
            </label>
            {liens.length > 0 && (
              <ul className="mt-2 space-y-1">
                {liens.map((l, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-principal hover:underline"
                    >
                      {l.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(i)}
                      className="text-xs text-gray-500 hover:text-alerte"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Libellé"
                className="min-h-[44px] w-full rounded border border-gray-200 px-3 py-2 text-base sm:min-h-0 sm:max-w-[140px] sm:py-1 sm:text-sm"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="URL"
                className="min-h-[44px] min-w-0 flex-1 rounded border border-gray-200 px-3 py-2 text-base sm:min-h-0 sm:py-1 sm:text-sm"
              />
              <button
                type="button"
                onClick={addLink}
                className="min-h-[44px] rounded bg-principal/15 px-4 py-2.5 text-sm font-medium text-principal hover:bg-principal/25 touch-manipulation sm:py-1"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t-2 border-principal/20">
            <button
              type="button"
              onClick={handleSauvegarderEtRetour}
              className="w-full min-h-[52px] rounded-xl bg-principal px-4 py-3.5 text-base font-bold text-white shadow-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-principal focus:ring-offset-2 touch-manipulation"
            >
              Sauvegarder & Retour au planning
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Les champs sont aussi enregistrés automatiquement à la sortie de chaque zone.
            </p>
          </div>
          </section>
        </div>
      </main>
    </div>
  );
}
