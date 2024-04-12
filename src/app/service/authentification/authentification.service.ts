import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerUser } from 'src/app/model/authentification/logged-user';
import { LoginRequest } from 'src/app/model/authentification/login-request';
import { LoginResponse } from 'src/app/model/authentification/login-response';
import { UserResponse } from 'src/app/model/user/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  jwtHelperService = new JwtHelperService();
  user = new BehaviorSubject<LoggerUser | null>(null);
  tokenExpirationTimer: any;

  private baseURL = 'http://localhost:8222';

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(user: LoginRequest) : Observable<LoginResponse>
  {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("password", user.password);

    return this.httpClient.post<LoginResponse>(this.baseURL + "/login", formData);
  }

  saveToken(jwtToken : LoginResponse)
  {
    const decodedAccessToken = this.jwtHelperService.decodeToken(jwtToken.accessToken);
    const loggedUser = new LoggerUser(decodedAccessToken.id ,decodedAccessToken.sub, decodedAccessToken.roles, jwtToken.accessToken, this.getExpirationDate(decodedAccessToken.exp));
    this.user.next(loggedUser);
    this.autoLogout(this.getExpirationDate(decodedAccessToken.exp).valueOf() - new Date().valueOf());
    localStorage.setItem('userData', JSON.stringify(loggedUser));
    this.redirectLoggedInUser(decodedAccessToken);
  }

  getExpirationDate(exp : number)
  {
    const date = new Date(0);
    date.setUTCSeconds(exp);

    return date;
  }

  redirectLoggedInUser(decodedToken: any)
  {
    if(decodedToken.roles.includes("ADMIN"))
    {
      this.router.navigateByUrl("dashboard").then(() => {
        window.location.reload();
      });
    } else if(decodedToken.roles.includes("AGENT"))
    {
      this.router.navigateByUrl("dashboard").then(() => {
        window.location.reload();
      });
    } else if(decodedToken.roles.includes("PROPRIETAIRE"))
    {
      this.router.navigateByUrl("plaintes").then(() => {
        window.location.reload();
      });
    } else if(decodedToken.roles.includes("SYNDEC"))
    {
      this.router.navigateByUrl("travaux").then(() => {
        window.location.reload();
      });
    }
  }

  logout()
  {
    localStorage.clear();
    this.user.next(null);
    this.router.navigate(['/']);

    if(this.tokenExpirationTimer)
    {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogin()
  {
    const userData: {
      id: number,
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date
    } = JSON.parse(localStorage.getItem('userData')!);

    if(!userData) return;

    const loadedUser = new LoggerUser(userData.id, userData.username, userData.roles, userData._token, new Date(userData._expiration));

    if(loadedUser.token)
    {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser._expiration.valueOf() - new Date().valueOf())
    }
  }

  refreshLocalStorage(user : UserResponse)
  {
    const userData: {
      id: number,
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date
    } = JSON.parse(localStorage.getItem('userData')!);

    if(!userData) return;

    const loadedUser = new LoggerUser(userData.id, user.userDto.username, userData.roles, userData._token, new Date(userData._expiration));

    if(loadedUser.token)
    {
      this.user.next(loadedUser);
      localStorage.setItem('userData', JSON.stringify(loadedUser));
      this.autoLogout(loadedUser._expiration.valueOf() - new Date().valueOf())
    }
  }

  autoLogout(expirationDuration : number)
  {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
