export interface Plainte {

  id: number;
  sujet: string;
  description: string;
  statusPlainte: StatusPlainte;
  urgence: Urgence;
  immeubleId: number;
  immeuble: any;
  agenceId: number;
  propreitaireCreatedBy: string;
  propreitaireUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Urgence {
  ELEVE = 'ELEVE',
  FAIBLE = 'FAIBLE',
  MOYENE = 'MOYENE'
}

export enum StatusPlainte {
  RESOLUE = 'RESOLUE',
  EN_COURS_TRAITEMENT = 'EN_COURS_TRAITEMENT',
  NON_RESOLUE = 'NON_RESOLUE'
}
