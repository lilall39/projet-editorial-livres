"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Etape, ProjetEditorial, Statut, SousTache } from "@/types";
import { getDefaultDeadline, getDefaultEtape, getDonneesInitiales } from "@/lib/data";
import { loadProjet, saveProjet } from "@/lib/storage";
import { getRappels } from "@/lib/reminders";

export function useProject() {
  const [projet, setProjet] = useState<ProjetEditorial | null>(null);
  const [rappels, setRappels] = useState<ReturnType<typeof getRappels>>([]);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setProjet(loadProjet());
  }, []);

  useEffect(() => {
    if (!projet) return;
    setRappels(getRappels(projet.etapes));
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveProjet(projet);
    setLastSavedAt(new Date());
  }, [projet]);

  const updateEtape = useCallback((id: string, patch: Partial<Etape>) => {
    setProjet((p) => {
      if (!p) return p;
      return {
        ...p,
        etapes: p.etapes.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      };
    });
  }, []);

  const updateEtapeDeadline = useCallback((id: string, deadline: string, modifieeManuellement = true) => {
    setProjet((p) => {
      if (!p) return p;
      return {
        ...p,
        etapes: p.etapes.map((e) =>
          e.id === id ? { ...e, deadline, dateModifieeManuellement: modifieeManuellement } : e
        ),
      };
    });
  }, []);

  const updateSousTache = useCallback(
    (etapeId: string, sousTacheId: string, statut: Statut) => {
      setProjet((p) => {
        if (!p) return p;
        return {
          ...p,
          etapes: p.etapes.map((e) => {
            if (e.id !== etapeId) return e;
            return {
              ...e,
              sousTaches: e.sousTaches.map((st) =>
                st.id === sousTacheId ? { ...st, statut } : st
              ),
            };
          }),
        };
      });
    },
    []
  );

  const updateSousTacheDetail = useCallback(
    (etapeId: string, sousTacheId: string, patch: Partial<SousTache>) => {
      setProjet((p) => {
        if (!p) return p;
        return {
          ...p,
          etapes: p.etapes.map((e) => {
            if (e.id !== etapeId) return e;
            return {
              ...e,
              sousTaches: e.sousTaches.map((st) =>
                st.id === sousTacheId ? { ...st, ...patch } : st
              ),
            };
          }),
        };
      });
    },
    []
  );

  const updateEtapeField = useCallback(
    <K extends keyof Etape>(id: string, field: K, value: Etape[K]) => {
      updateEtape(id, { [field]: value });
    },
    [updateEtape]
  );

  const resetEtape = useCallback((id: string) => {
    const dateLancement = projet?.dateLancement;
    const def = getDefaultEtape(id, dateLancement);
    if (!def) return;
    setProjet((p) => {
      if (!p) return p;
      return {
        ...p,
        etapes: p.etapes.map((e) =>
          e.id === id
            ? {
                ...def,
                responsable: "",
                notes: "",
                dateModifieeManuellement: false,
                sousTaches: def.sousTaches.map((st) => ({
                  ...st,
                  statut: "a_faire" as const,
                  objectifAFaire: undefined,
                  ceQuiAFait: undefined,
                  responsable: undefined,
                  notes: undefined,
                  liens: undefined,
                })),
                liens: [],
              }
            : e
        ),
      };
    });
  }, [projet?.dateLancement]);

  const resetProjet = useCallback(() => {
    setProjet(getDonneesInitiales());
  }, []);

  const getDefaultDeadlineForEtape = useCallback(
    (etapeId: string): string => {
      const dateLancement = projet?.dateLancement;
      if (dateLancement) return getDefaultDeadline(etapeId, dateLancement);
      const def = getDefaultEtape(etapeId);
      return def?.deadline ?? "";
    },
    [projet?.dateLancement]
  );

  const revenirPlanningAuto = useCallback(
    (id: string) => {
      const deadline = getDefaultDeadlineForEtape(id);
      updateEtape(id, { deadline, dateModifieeManuellement: false });
    },
    [getDefaultDeadlineForEtape, updateEtape]
  );

  const setDateLancement = useCallback((date: string | undefined) => {
    setProjet((p) => {
      if (!p) return p;
      return { ...p, dateLancement: date };
    });
  }, []);

  const marquerFait = useCallback(
    (id: string) => updateEtape(id, { statut: "fait" }),
    [updateEtape]
  );

  const replaceProjet = useCallback((next: ProjetEditorial) => {
    setProjet(next);
  }, []);

  return {
    projet,
    rappels,
    lastSavedAt,
    replaceProjet,
    updateEtape,
    updateEtapeDeadline,
    updateEtapeField,
    updateSousTache,
    updateSousTacheDetail,
    resetEtape,
    resetProjet,
    revenirPlanningAuto,
    marquerFait,
    getDefaultDeadlineForEtape,
    setDateLancement,
  };
}
