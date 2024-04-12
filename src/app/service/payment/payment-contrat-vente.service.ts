import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentContratLoyer } from 'src/app/model/payment/payment-contrat-loyer';
import { PaymentContratVente } from 'src/app/model/payment/payment-contrat-vente';

@Injectable({
  providedIn: 'root'
})
export class PaymentContratVenteService {

  private baseURL = "http://localhost:8222/api/v1/payment-contrat-ventes";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<PaymentContratVente[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<PaymentContratVente[]>(this.baseURL + '/agence', { params: params });
  }

  savePaymentVente(paymentVente: PaymentContratVente) : Observable<PaymentContratVente>
  {
    return this.httpClient.post<PaymentContratVente>(this.baseURL, paymentVente);
  }

  updatePaymentVente(id: number, paymentVente: PaymentContratVente) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, paymentVente);
  }

  deletePaymentVente(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<PaymentContratVente>
  {
    return this.httpClient.get<PaymentContratVente>(this.baseURL + '/' + id);
  }
}
