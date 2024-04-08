import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from 'src/app/model/user/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = "http://localhost:8222/api/v1/users";

  constructor(private httpClient: HttpClient) { }

  loggedUser(): Observable<UserResponse>
  {
    return this.httpClient.get<UserResponse>(this.baseURL + "/logged");
  }

  updatePhotoProfilLogo(id: number, userPhoto: FormData) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/photo', userPhoto);
  }
}
