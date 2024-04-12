import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuardService implements CanActivate {

  constructor(private authService: AuthentificationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(take(1), map(user => {
      console.log(user , '+++++++++++++++');

      const isAuth = !!user;
      if (isAuth) {
        const roles = route.data['role'] as string[];
        if (roles.some(role => user.roles.includes(role))) return true;
        else if (user.roles.includes('ADMIN')) return this.router.createUrlTree(['/dashboard']);
        else if (user.roles.includes('AGENT')) return this.router.createUrlTree(['/dashboard']);
        else if (user.roles.includes('PROPRIETAIRE')) return this.router.createUrlTree(['/plaintes']);
        else if (user.roles.includes('SYNDEC')) return this.router.createUrlTree(['/travaux']);
      }

      return this.router.createUrlTree(['/login']);
    }));
  }
}
