import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentSyndec } from 'src/app/model/payment/payment-syndec';

@Injectable({
  providedIn: 'root'
})
export class PaymentSyndecService {

  private baseURL = "http://localhost:8222/api/v1/payment-syndecals";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<PaymentSyndec[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<PaymentSyndec[]>(this.baseURL + '/agence', { params: params });
  }

  savePaymentSyndec(paymentSyndec: PaymentSyndec) : Observable<PaymentSyndec>
  {
    return this.httpClient.post<PaymentSyndec>(this.baseURL, paymentSyndec);
  }

  updatePaymentSyndec(id: number, paymentSyndec: PaymentSyndec) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, paymentSyndec);
  }

  deletePaymentSyndec(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<PaymentSyndec>
  {
    return this.httpClient.get<PaymentSyndec>(this.baseURL + '/' + id);
  }
}
