export interface Travaux {

  id: number;
  sujet: string;
  description: string;
  etat: Etat;
  dateDebut: Date;
  dateFin: Date;
  montant: number;
  immeubleId: number;
  immeuble: any;
  agenceId: number;
  syndecCreatedBy: string;
  syndecUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Etat {
  URGENT = 'URGENT',
  NON_URGENT = 'NON_URGENT'
}
