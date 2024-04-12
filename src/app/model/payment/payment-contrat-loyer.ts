import { MethodePaymentContratLoyer } from "./methode-payment-contrat-loyer";
import { StatusPaymentContrat } from "./status-payment-contrat";
import { TypePaymentContratLoyer } from "./type-payment-contrat-loyer";

export interface PaymentContratLoyer {

  id: number;
  statusPaymentContrat: StatusPaymentContrat;
  contratId: number;
  contrat : any;
  montantPaye: number;
  typePaymentContratLoyer: TypePaymentContratLoyer;
  methodePaymentContratLoyer: MethodePaymentContratLoyer;
  agenceId: number;
  agentCreatedBy: string;
  agentUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
