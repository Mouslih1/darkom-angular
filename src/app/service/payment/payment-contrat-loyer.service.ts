import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentContratLoyer } from 'src/app/model/payment/payment-contrat-loyer';

@Injectable({
  providedIn: 'root'
})
export class PaymentContratLoyerService {

  private baseURL = "http://localhost:8222/api/v1/payment-contrat-loyers";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<PaymentContratLoyer[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<PaymentContratLoyer[]>(this.baseURL + '/agence', { params: params });
  }

  savePaymentLoyer(paymentLoyer: PaymentContratLoyer) : Observable<PaymentContratLoyer>
  {
    return this.httpClient.post<PaymentContratLoyer>(this.baseURL, paymentLoyer);
  }

  updatePaymentLoyer(id: number, paymentLoyer: PaymentContratLoyer) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, paymentLoyer);
  }

  deletePaymentLoyer(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<PaymentContratLoyer>
  {
    return this.httpClient.get<PaymentContratLoyer>(this.baseURL + '/' + id);
  }
}
