import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// HTTP client service uses observables
import { BehaviorSubject, Observable, throwError,  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Account } from '@app/model/account';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authSubject: BehaviorSubject<boolean>;
  public isAuthenticated: Observable<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    this.authSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated = this.authSubject.asObservable();
  }

  // Login with username and password
  login(username: string, password: string) {
    const loginUrl = `${environment.apiUrl}/login`;

    const body = { username: username, password: password };

    return this.http.post<Account>(loginUrl, body)
      .pipe(
        map( account => {
          localStorage.setItem('token', 'JWT');
          this.authSubject.next(true);
          return account;
          }),
        catchError(this.handleError)
      );
  }

  // Logout - removes user from local storage and redirects to login
  logout(): void {
    localStorage.clear();
    this.authSubject.next(false);
    this.router.navigate(['']);
  }

  // Check if JWT token is stored in local storage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse): Observable<Error> {

    const userMessage = `Login failed.`;
    if (error.error instanceof ErrorEvent) {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(`${userMessage}: ${error.error}`);
  }
}
