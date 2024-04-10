import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Immeuble } from 'src/app/model/immeuble/immeuble';

@Injectable({
  providedIn: 'root'
})
export class ImmeubleService {


  private baseURL = "http://localhost:8222/api/v1/immeubles";

  constructor(private httpClient: HttpClient) { }

  all(pageNo: number, pageSize: number ): Observable<Immeuble[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<Immeuble[]>(this.baseURL + '/agence', { params: params });
  }

  saveImmeuble(immeuble: Immeuble) : Observable<Immeuble>
  {
    return this.httpClient.post<Immeuble>(this.baseURL, immeuble);
  }

  updateImmeuble(id: number, immeuble: Immeuble) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, immeuble);
  }

  deleteImmeuble(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  getById(id: number) : Observable<Immeuble>
  {
    return this.httpClient.get<Immeuble>(this.baseURL + '/' + id);
  }
}
