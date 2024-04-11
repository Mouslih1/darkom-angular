import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrat } from 'src/app/model/contrat/contrat';

@Injectable({
  providedIn: 'root'
})
export class ContratService {

  private baseURL = "http://localhost:8222/api/v1/contrats";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Contrat[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Contrat[]>(this.baseURL, { params: params });
  }

  saveContrat(contrat: Contrat) : Observable<Contrat>
  {
    return this.httpClient.post<Contrat>(this.baseURL, contrat);
  }

  updateContrat(id: number, contrat: Contrat) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, contrat);
  }

  deleteContrat(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }
}
