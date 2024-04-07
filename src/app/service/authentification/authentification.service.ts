import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { LoginRequest } from 'src/app/model/authentification/login-request';
import { LoginResponse } from 'src/app/model/authentification/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  jwtHelperService = new JwtHelperService();

  private baseURL = 'http://localhost:8222';

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(user: LoginRequest) : Observable<LoginResponse>
  {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("password", user.password);

    return this.httpClient.post<LoginResponse>(this.baseURL + "/login", formData);
  }

  saveToken(jwtToken: LoginResponse)
  {
    const decodedAccessToken = this.jwtHelperService.decodeToken(jwtToken.accessToken);
    console.log(decodedAccessToken);

  }
}
