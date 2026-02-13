"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Etape, Statut } from "@/types";
import { labelStatut, isDeadlineDepassee } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatutBadge } from "@/components/StatutBadge";

interface FicheDetailProps {
  etape: Etape;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Etape>) => void;
  onUpdateEtapeDeadline?: (id: string, deadline: string, modifieeManuellement: boolean) => void;
  onUpdateSousTache: (etapeId: string, sousTacheId: string, statut: Statut) => void;
  onResetEtape?: (id: string) => void;
  onRevenirPlanningAuto?: (id: string) => void;
  onMarquerFait?: (id: string) => void;
}

const STATUTS: Statut[] = ["a_faire", "en_cours", "fait"];

export function FicheDetail({
  etape,
  onClose,
  onUpdate,
  onUpdateEtapeDeadline,
  onUpdateSousTache,
  onResetEtape,
  onRevenirPlanningAuto,
  onMarquerFait,
}: FicheDetailProps) {
  const [notes, setNotes] = useState(etape.notes);
  const [responsable, setResponsable] = useState(etape.responsable);
  const enRetard =
    etape.statut !== "fait" && isDeadlineDepassee(etape.deadline);
  const setDeadline = useCallback(
    (deadline: string, modifieeManuellement: boolean) => {
      if (onUpdateEtapeDeadline) {
        onUpdateEtapeDeadline(etape.id, deadline, modifieeManuellement);
      } else {
        onUpdate(etape.id, { deadline });
      }
    },
    [etape.id, onUpdate, onUpdateEtapeDeadline]
  );

  useEffect(() => {
    setNotes(etape.notes);
    setResponsable(etape.responsable);
  }, [etape.id, etape.notes, etape.responsable]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = useCallback(() => {
    onUpdate(etape.id, { notes });
  }, [etape.id, notes, onUpdate]);

  const saveResponsable = useCallback(() => {
    onUpdate(etape.id, { responsable });
  }, [etape.id, responsable, onUpdate]);

  const handleResetEtape = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Réinitialiser cette étape ? Statut, date, responsable, notes et sous-tâches seront remis aux valeurs par défaut. Cette action est irréversible."
      )
    )
      return;
    onResetEtape?.(etape.id);
    onClose();
  }, [etape.id, onClose, onResetEtape]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fiche-titre"
    >
      <div
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-gray-200 bg-white shadow-xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Planning", onClick: onClose },
              { label: etape.titre },
            ]}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="fiche-titre" className="text-lg font-semibold text-principal sm:text-xl min-w-0 truncate pr-2">{etape.titre}</h2>
            <StatutBadge statut={etape.statut} enRetard={enRetard} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-principal hover:bg-principal/10 focus:outline-none focus:ring-2 focus:ring-principal/30 touch-manipulation sm:py-2"
          >
            Retour au planning global
          </button>
        </div>

        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Responsable
            </label>
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              onBlur={saveResponsable}
              placeholder="Nom du responsable"
              className="mt-1 min-h-[44px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={etape.deadline}
              onChange={(e) => setDeadline(e.target.value, true)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
            {etape.dateModifieeManuellement && (
              <p className="mt-1 text-xs text-gray-500">
                Date modifiée à la main (verrouillée au planning auto)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Statut de l&apos;étape
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <select
                value={etape.statut}
                onChange={(e) =>
                  onUpdate(etape.id, { statut: e.target.value as Statut })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal sm:max-w-[200px]"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {labelStatut(s)}
                  </option>
                ))}
              </select>
              <StatutBadge statut={etape.statut} enRetard={enRetard} />
            </div>
          </div>

          {enRetard && (onRevenirPlanningAuto || onMarquerFait) && (
            <div className="rounded-lg border border-alerte/20 bg-alerte/5 p-4">
              <p className="mb-3 text-sm font-medium text-alerte">
                Cette étape est en retard
              </p>
              <div className="flex flex-wrap gap-2">
                {onRevenirPlanningAuto && (
                  <button
                    type="button"
                    onClick={() => onRevenirPlanningAuto(etape.id)}
                    className="rounded-lg bg-principal/15 px-3 py-2 text-sm font-medium text-principal hover:bg-principal/25 focus:outline-none focus:ring-2 focus:ring-principal/30"
                  >
                    Revenir au planning auto
                  </button>
                )}
                {onMarquerFait && (
                  <button
                    type="button"
                    onClick={() => onMarquerFait(etape.id)}
                    className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    Marquer comme fait
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Modifier la date ci-dessus pour ajuster l&apos;échéance.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sous-tâches
            </label>
            <ul className="mt-2 space-y-2">
              {etape.sousTaches.map((st) => (
                <li
                  key={st.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2"
                >
                  <Link
                    href={`/etape/${etape.id}/sous-tache/${st.id}`}
                    prefetch={false}
                    className="min-w-0 flex-1 text-sm font-medium text-principal hover:underline"
                  >
                    {st.libelle}
                  </Link>
                  <select
                    value={st.statut}
                    onChange={(e) =>
                      onUpdateSousTache(etape.id, st.id, e.target.value as Statut)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-principal focus:outline-none"
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>
                        {labelStatut(s)}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-gray-500">
              Cliquez sur une sous-tâche pour ouvrir sa fiche détail.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={3}
              placeholder="Notes libres..."
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-principal focus:outline-none focus:ring-1 focus:ring-principal"
            />
          </div>

          {etape.liens.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Liens utiles
              </label>
              <ul className="mt-2 space-y-1">
                {etape.liens.map((l, i) => (
                  <li key={i}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-principal hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onResetEtape && (
            <div className="border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handleResetEtape}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Réinitialiser cette étape
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Remet le statut à « À faire », la date par défaut, et efface responsable, notes et sous-tâches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
