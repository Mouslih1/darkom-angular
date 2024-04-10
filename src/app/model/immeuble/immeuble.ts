import { StatusImmeuble } from "./status-immeuble";

export interface Immeuble {

  id: number;
  referenceImmeuble: string;
  address: string;
  numberEtage: number;
  numberApparetement: number;
  anneeConstruction: Date;
  agenceId: number;
  statusImmeuble: StatusImmeuble;
  agentCreatedBy?: string;
  agentUpdatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
