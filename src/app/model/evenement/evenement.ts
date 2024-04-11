export interface Evenement {

  id: number;
  sujet: string;
  description: string;
  dateEvenement: Date;
  appartementId: number;
  appartment: any;
  agenceId: number;
  propreitaireCreatedBy: string;
  propreitaireUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
