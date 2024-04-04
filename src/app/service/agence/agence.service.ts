import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgenceRequest } from 'src/app/model/agence/agence-request';
import { AgenceResponse } from 'src/app/model/agence/agence-response';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private baseURL = "http://localhost:8222/api/v1/agences";

  constructor(private httpClient: HttpClient) { }

  saveAgence(agence: FormData): Observable<AgenceResponse> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjE5NjI0M30.3qczoqxToacDrEvko5i_bnXlCvam08nm1oz6DLHR6dA'
    });

    return this.httpClient.post<AgenceResponse>(this.baseURL, agence, { headers: headers });
  }

  all(): Observable<AgenceResponse[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuaWhhbiIsImFnZW5jZUlkIjoyLCJyb2xlcyI6WyJBR0VOVCJdLCJpc3MiOiJTcHJpbmdCb290QXBwIiwiaWQiOjgsImV4cCI6MTcxMjE5NjI0M30.3qczoqxToacDrEvko5i_bnXlCvam08nm1oz6DLHR6dA'
    });

    return this.httpClient.get<AgenceResponse[]>(this.baseURL, { headers: headers });
  }
}
