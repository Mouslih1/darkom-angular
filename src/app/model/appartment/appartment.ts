import { EtatAppartement } from "./etat-appartment";
import { StatusAppartement } from "./status-appartment";

export interface Appartment {

  id: number;
  referenceAppartement: string;
  numberChambre: number;
  surface: number;
  prixLocation: number;
  prixVente: number;
  statusAppartement: StatusAppartement;
  etatAppartement: EtatAppartement;
  immeuble: any;
  immeubleId: number;
  agenceId: number;
  agentCreatedBy: string;
  agentUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
