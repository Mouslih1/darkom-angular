import { MethodePaymentContratLoyer } from "./methode-payment-contrat-loyer";
import { StatusPaymentContrat } from "./status-payment-contrat";
import { TypePaymentSyndec } from "./type-payment-syndec";

export interface PaymentSyndec {
  id: number;
  description: string;
  montantPaye: number;
  typePaymentSyndecal: TypePaymentSyndec;
  methodePaymentSyndecal: MethodePaymentContratLoyer;
  statusPaymentSyndecal: StatusPaymentContrat;
  agenceId?: number;
  payerId: number;
  propreitaire: any;
  agentCreatedBy?: string;
  agentUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
