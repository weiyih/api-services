import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ){}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // https://github.com/cornflourblue/angular-10-basic-authentication-example/blob/master/src/app/_helpers/basic-auth.interceptor.ts
  // add header with basic auth credentials if user is logged in and request is to the api url
  //  const user = this.authService.userValue;
  //  const isLoggedIn = user && user.authdata;
  //  const isApiUrl = request.url.startsWith(environment.apiUrl);
  //  if (isLoggedIn && isApiUrl) {
  //   request = request.clone({
  //                  setHeaders: {
  //                      Authorization: `Basic ${user.authdata}`
  //                  }
  //              });
  //          }


  //   const idToken = localStorage.getItem('id_token');
  //   if (idToken) {
  //     const cloned = req.clone({
  //       headers: req.headers.set('Authorization', 'Bearer ' + idToken),
  //     });

  //     return next.handle(cloned);
  //   } else {
  //     return next.handle(req);
  //   }
  // }

    return next.handle(request);
  }
}
