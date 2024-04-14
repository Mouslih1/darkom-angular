import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { UserPasswordDto } from 'src/app/model/user/user-password-dto';
import { UserRequest } from 'src/app/model/user/user-request';
import { UserResponse } from 'src/app/model/user/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loggedUserInfoSource = new Subject<any>();
  loggedUserInfo$ = this.loggedUserInfoSource.asObservable();

  private baseURL = "http://localhost:8222/api/v1/users";

  constructor(private httpClient: HttpClient) { }

  loggedUser(): Observable<any>
  {
    return this.httpClient.get<any>(this.baseURL + '/logged').pipe(
      tap((data) => {
        this.loggedUserInfoSource.next(data);
      })
    );
  }

  updatePhotoProfil(userPhoto: FormData): Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/photo', userPhoto).pipe(
      tap(() => {
        this.loggedUser().subscribe();
      })
    );
  }

  updateUserInfo(user: UserRequest) :  Observable<UserResponse>
  {
    return this.httpClient.put<UserResponse>(this.baseURL + '/update/logged' , user).pipe(
      tap(() => {
        this.loggedUser().subscribe();
      })
    );
  }

  updateUserPassword(user: UserPasswordDto) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/update-password' , user);
  }

  getUserbyId(id: number): Observable<UserResponse>
  {
    return this.httpClient.get<UserResponse>(this.baseURL + '/' + id);
  }

  saveUser(user: FormData): Observable<UserResponse>
  {
    console.log("save user service : ", user);
    return this.httpClient.post<UserResponse>(this.baseURL + '/register', user);
  }

  saveUserAdmin(user: FormData): Observable<UserResponse>
  {
    console.log("save user service : ", user);
    return this.httpClient.post<UserResponse>(this.baseURL + '/register/admin', user);
  }

  allByAgence(pageNo: number, pageSize: number ): Observable<UserResponse[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<UserResponse[]>(this.baseURL + '/agence', { params: params });
  }

  all(pageNo: number, pageSize: number ): Observable<UserResponse[]>
  {
    let params = new HttpParams();
    params = params.append('pageNo', pageNo.toString());
    params = params.append('pageSize', pageSize.toString());


    return this.httpClient.get<UserResponse[]>(this.baseURL, { params: params });
  }

  updateUserInfoById(id: number, user: UserRequest) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id, user);
  }

  updateUserInfoByIdByAdmin(id: number, user: UserRequest) :  Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/' + id + '/admin', user);
  }

  deleteUser(id: number) : Observable<Object>
  {
    return this.httpClient.delete(this.baseURL + '/' + id);
  }

  updatePhotoProfilById(id: number, userPhoto: FormData) : Observable<Object>
  {
    return this.httpClient.put(this.baseURL + '/photo/' + id, userPhoto);
  }

  forgotPassword(email: string): Observable<any>
  {
    let params = new HttpParams().set('email', email);
    return this.httpClient.put<any>(this.baseURL + '/forgot-password', null, { params: params });
  }

  setPassword(email: string, newPassword: string): Observable<any>
  {
    let params = new HttpParams().set('email', email);

    const headers = new HttpHeaders({
      'newPassword': newPassword
    });

    return this.httpClient.put<any>(`${this.baseURL}/set-password`, null, { headers, params });
  }
}
