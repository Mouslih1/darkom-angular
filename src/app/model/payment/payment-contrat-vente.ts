import { MethodePaymentContratVente } from "./methode-payment-contrat-vente";
import { StatusPaymentContrat } from "./status-payment-contrat";
import { TypePaymentContratVente } from "./type-payment-contrat-vente";

export interface PaymentContratVente {

  id: number;
  statusPaymentContrat: StatusPaymentContrat;
  contratId: number;
  contrat: any;
  montantPaye: number;
  typePaymentContratVente: TypePaymentContratVente;
  methodePaymentContratVente: MethodePaymentContratVente;
  montantRester: number;
  agenceId: number;
  agentCreatedBy: string;
  agentUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
