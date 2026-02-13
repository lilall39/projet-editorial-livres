import type { Etape, ProjetEditorial } from "@/types";

const JOUR = 24 * 60 * 60 * 1000;
const fmt = (d: Date) => d.toISOString().slice(0, 10);

/** Offset en jours après la date de lancement pour chaque étape (planning auto) */
export const OFFSET_JOURS: Record<string, number> = {
  fondations: 14,
  organisation: 21,
  methode_production: 28,
  production_livre1: 90,
  identite_image: 45,
  diffusion_lecteurs: 120,
  international: 150,
  pilotage_global: 180,
};

function j(now: Date, n: number) {
  const d = new Date(now.getTime() + n * JOUR);
  return fmt(d);
}

function buildEtapes(now: Date): Etape[] {
  return [
    {
      id: "fondations",
      titre: "Fondations",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.fondations),
      statut: "a_faire",
      dependances: [],
      notes: "Vision, ligne éditoriale, règles, cadre juridique, nom de la collection.",
      liens: [],
      sousTaches: [
        { id: "f1", libelle: "Vision & ligne éditoriale", statut: "a_faire" },
        { id: "f2", libelle: "Règles et cadre juridique", statut: "a_faire" },
        { id: "f3", libelle: "Nom de la collection", statut: "a_faire" },
      ],
    },
    {
      id: "organisation",
      titre: "Organisation",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.organisation),
      statut: "a_faire",
      dependances: [],
      notes: "Rôles, équipe, responsabilités.",
      liens: [],
      sousTaches: [
        { id: "o1", libelle: "Définir les rôles", statut: "a_faire" },
        { id: "o2", libelle: "Constituer l'équipe", statut: "a_faire" },
        { id: "o3", libelle: "Répartition des responsabilités", statut: "a_faire" },
      ],
    },
    {
      id: "methode_production",
      titre: "Méthode de production",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.methode_production),
      statut: "a_faire",
      dependances: ["fondations", "organisation"],
      notes: "Process écriture → relecture → corrections → validation.",
      liens: [],
      sousTaches: [
        { id: "m1", libelle: "Process écriture", statut: "a_faire" },
        { id: "m2", libelle: "Process relecture", statut: "a_faire" },
        { id: "m3", libelle: "Corrections & validation", statut: "a_faire" },
      ],
    },
    {
      id: "production_livre1",
      titre: "Production du livre 1",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.production_livre1),
      statut: "a_faire",
      dependances: ["methode_production"],
      notes: "Rédaction, relecture, corrections, préparation publication, publication.",
      liens: [],
      sousTaches: [
        { id: "p1", libelle: "Rédaction", statut: "a_faire" },
        { id: "p2", libelle: "Relecture", statut: "a_faire" },
        { id: "p3", libelle: "Corrections", statut: "a_faire" },
        { id: "p4", libelle: "Préparation publication", statut: "a_faire" },
        { id: "p5", libelle: "Publication", statut: "a_faire" },
      ],
    },
    {
      id: "identite_image",
      titre: "Identité & image",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.identite_image),
      statut: "a_faire",
      dependances: [],
      notes: "Nom, logo, direction artistique, couverture.",
      liens: [],
      sousTaches: [
        { id: "i1", libelle: "Nom & logo", statut: "a_faire" },
        { id: "i2", libelle: "Direction artistique", statut: "a_faire" },
        { id: "i3", libelle: "Couverture", statut: "a_faire" },
      ],
    },
    {
      id: "diffusion_lecteurs",
      titre: "Diffusion & lecteurs",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.diffusion_lecteurs),
      statut: "a_faire",
      dependances: ["production_livre1"],
      notes: "Mode d'édition, canaux de vente, présence en ligne, retours lecteurs.",
      liens: [],
      sousTaches: [
        { id: "d1", libelle: "Mode d'édition", statut: "a_faire" },
        { id: "d2", libelle: "Canaux de vente", statut: "a_faire" },
        { id: "d3", libelle: "Présence en ligne", statut: "a_faire" },
        { id: "d4", libelle: "Retours lecteurs", statut: "a_faire" },
      ],
    },
    {
      id: "international",
      titre: "International",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.international),
      statut: "a_faire",
      dependances: ["production_livre1"],
      notes: "Préparation traductions arabe / anglais / français.",
      liens: [],
      sousTaches: [
        { id: "int1", libelle: "Préparation traduction arabe", statut: "a_faire" },
        { id: "int2", libelle: "Préparation traduction anglais", statut: "a_faire" },
        { id: "int3", libelle: "Préparation traduction français", statut: "a_faire" },
      ],
    },
    {
      id: "pilotage_global",
      titre: "Pilotage global",
      responsable: "",
      deadline: j(now, OFFSET_JOURS.pilotage_global),
      statut: "a_faire",
      dependances: [],
      notes: "Suivi, validations, rappels, avancement.",
      liens: [],
      sousTaches: [
        { id: "pil1", libelle: "Suivi des étapes", statut: "a_faire" },
        { id: "pil2", libelle: "Validations", statut: "a_faire" },
        { id: "pil3", libelle: "Rappels & alertes", statut: "a_faire" },
      ],
    },
  ];
}

export function getDonneesInitiales(dateLancement?: string): ProjetEditorial {
  const ref = dateLancement ? new Date(dateLancement) : new Date();
  return {
    nom: "Roman – Projet éditorial",
    derniereModif: new Date().toISOString(),
    dateLancement: ref.toISOString().slice(0, 10),
    etapes: buildEtapes(ref),
  };
}

export function getDefaultEtape(id: string, dateLancement?: string): Etape | undefined {
  const init = getDonneesInitiales(dateLancement);
  return init.etapes.find((e) => e.id === id);
}

/** Date d'échéance par défaut pour une étape (date lancement + offset). */
export function getDefaultDeadline(etapeId: string, dateLancement: string): string {
  const offset = OFFSET_JOURS[etapeId] ?? 0;
  const d = new Date(dateLancement);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function getEtapeById(etapes: Etape[], id: string): Etape | undefined {
  return etapes.find((e) => e.id === id);
}

export function getSousTache(etapes: Etape[], etapeId: string, sousTacheId: string) {
  const etape = getEtapeById(etapes, etapeId);
  return etape?.sousTaches.find((st) => st.id === sousTacheId);
}
