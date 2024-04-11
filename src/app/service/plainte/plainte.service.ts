import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plainte } from 'src/app/model/plainte/plainte';

@Injectable({
  providedIn: 'root'
})
export class PlainteService {

  private baseURL = "http://localhost:8222/api/v1/plaintes";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Plainte[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Plainte[]>(this.baseURL + '/agence', { params: params });
  }

  savePlainte(plainte: Plainte) : Observable<Plainte>
  {
    return this.httpClient.post<Plainte>(this.baseURL, plainte);
  }

  updatePlainte(id: number, plainte: Plainte) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, plainte);
  }

  deletePlainte(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<Plainte>
  {
    return this.httpClient.get<Plainte>(this.baseURL + '/' + id);
  }
}
