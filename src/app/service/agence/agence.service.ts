import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgenceRequest } from 'src/app/model/agence/agence-request';
import { AgenceResponse } from 'src/app/model/agence/agence-response';
import { AgenceRequestLogo } from 'src/app/model/agence/agence-request-logo';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private baseURL = "http://localhost:8222/api/v1/agences";

  constructor(private httpClient: HttpClient) { }

  saveAgence(agence: FormData): Observable<AgenceResponse>
  {
    console.log("save agence service : ", agence);
    return this.httpClient.post<AgenceResponse>(this.baseURL, agence);
  }

  all(pageNo: number, pageSize: number ): Observable<AgenceResponse[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<AgenceResponse[]>(this.baseURL, { params: params });
  }

  updateAgenceLogo(id: number, agenceLogo: FormData) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/logo/' + id, agenceLogo);
  }

  updateAgenceInfo(id: number, agence: AgenceRequest) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, agence);
  }

  deleteAgence(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<AgenceResponse>
  {
    return this.httpClient.get<AgenceResponse>(this.baseURL + '/' + id);
  }
}
