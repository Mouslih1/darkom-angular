import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Travaux } from 'src/app/model/travaux/travaux';

@Injectable({
  providedIn: 'root'
})
export class TravauxService {


  private baseURL = "http://localhost:8222/api/v1/travaux";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Travaux[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Travaux[]>(this.baseURL + '/agence', { params: params });
  }

  saveTravaux(travaux: Travaux) : Observable<Travaux>
  {
    return this.httpClient.post<Travaux>(this.baseURL, travaux);
  }

  updateTravaux(id: number, travaux: Travaux) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, travaux);
  }

  deleteTravaux(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<Travaux>
  {
    return this.httpClient.get<Travaux>(this.baseURL + '/' + id);
  }
}
