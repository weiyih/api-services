import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // User authorised
    // TODO - Load user from authService const user = this.authService.userValue;
    const userAuth = this.authService.isAuthenticated;
    if (userAuth) {
      return true;
    }
    // User not logged in redirect to login page
    this.router.navigate(['/login']);
    return false;

  }
}
