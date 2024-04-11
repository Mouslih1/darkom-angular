import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from 'src/app/model/evenement/evenement';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private baseURL = "http://localhost:8222/api/v1/evenements";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Evenement[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Evenement[]>(this.baseURL + '/agence', { params: params });
  }

  saveEvenement(evenement: Evenement) : Observable<Evenement>
  {
    return this.httpClient.post<Evenement>(this.baseURL, evenement);
  }

  updateEvenement(id: number, evenement: Evenement) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, evenement);
  }

  deleteEvenement(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<Evenement>
  {
    return this.httpClient.get<Evenement>(this.baseURL + '/' + id);
  }
}
