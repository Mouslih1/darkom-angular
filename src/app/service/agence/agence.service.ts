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
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjQzMTgwOX0.taUCNLp76V2hgB2AATLFbpVtDCF7o3TyOy92v0O8xnU'
    });

    console.log("save agence service : ", agence);
    return this.httpClient.post<AgenceResponse>(this.baseURL, agence, { headers: headers });
  }

  all(pageNo: number, pageSize: number ): Observable<AgenceResponse[]>
  {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjQzMTgwOX0.taUCNLp76V2hgB2AATLFbpVtDCF7o3TyOy92v0O8xnU'
    });

    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<AgenceResponse[]>(this.baseURL, { headers: headers, params: params });
  }

  updateAgenceLogo(id: number, agenceLogo: FormData) :  Observable<Object>
  {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjQzMTgwOX0.taUCNLp76V2hgB2AATLFbpVtDCF7o3TyOy92v0O8xnU'
    });

    return this.httpClient.put(this.baseURL + '/logo/' + id, agenceLogo, { headers: headers });
  }

  updateAgenceInfo(id: number, agence: AgenceRequest) :  Observable<Object>
  {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjQzMTgwOX0.taUCNLp76V2hgB2AATLFbpVtDCF7o3TyOy92v0O8xnU'
    });

    return this.httpClient.put(this.baseURL + '/' + id, agence, { headers: headers });
  }

  deleteAgence(id: number) : Observable<Object>
  {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjQzMTgwOX0.taUCNLp76V2hgB2AATLFbpVtDCF7o3TyOy92v0O8xnU'
    });

    return this.httpClient.delete(this.baseURL + '/' + id, { headers: headers });
  }
}
