import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appartment } from 'src/app/model/appartment/appartment';

@Injectable({
  providedIn: 'root'
})
export class AppartmentService {

  private baseURL = "http://localhost:8222/api/v1/appartements";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Appartment[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Appartment[]>(this.baseURL, { params: params });
  }

  saveAppartement(appartement: Appartment) : Observable<Appartment>
  {
    return this.httpClient.post<Appartment>(this.baseURL, appartement);
  }

  updateAppartement(id: number, appartement: Appartment) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, appartement);
  }

  deleteAppartement(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }
}
