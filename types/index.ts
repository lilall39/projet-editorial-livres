export type Statut = "a_faire" | "en_cours" | "fait";

export interface SousTache {
  id: string;
  libelle: string;
  statut: Statut;
  deadline?: string; // ISO date
  /** Objectif / à faire */
  objectifAFaire?: string;
  /** Ce qui a été fait */
  ceQuiAFait?: string;
  responsable?: string;
  notes?: string;
  liens?: { label: string; url: string }[];
}

export interface Etape {
  id: string;
  titre: string;
  responsable: string;
  deadline: string; // ISO date
  statut: Statut;
  sousTaches: SousTache[];
  notes: string;
  liens: { label: string; url: string }[];
  dependances: string[];
  /** true si la date a été modifiée à la main (verrouillage planning auto) */
  dateModifieeManuellement?: boolean;
}

export interface ProjetEditorial {
  nom: string;
  etapes: Etape[];
  derniereModif: string; // ISO
  /** Date de lancement du projet (recalcul des échéances auto) */
  dateLancement?: string; // ISO date
}

export interface Rappel {
  type: "rappel" | "alerte"; // rappel = avant deadline, alerte = dépassé
  etapeId: string;
  etapeTitre: string;
  deadline: string;
  message: string;
}
