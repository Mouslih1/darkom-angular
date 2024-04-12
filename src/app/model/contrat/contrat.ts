import { TypeContrat } from "./type-contrat";

export interface Contrat {

  id: number;
  refContrat: string ;
  typeContrat: TypeContrat;
  dateSignature: Date;
  appartementId: number;
  propreitaireId: number;
  appartement: any;
  propreitaire: any;
  montant: number;
  agenceId: number;
  agentCreatedBy: string;
  agentUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}
