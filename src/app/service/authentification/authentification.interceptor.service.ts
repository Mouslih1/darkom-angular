import { Injectable } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, exhaustMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationInterceptorService implements HttpInterceptor {

  constructor(private authService : AuthentificationService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if(!user)
      {
        return next.handle(req);
      }

      const modifiedRequest = req.clone({headers: new HttpHeaders({'Authorization': 'Bearer ' + user.token})});
      return next.handle(modifiedRequest);
    }));
  }
}
