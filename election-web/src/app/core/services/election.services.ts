import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '@environments';
import { Election } from '@app/model/election';

@Injectable()
export class ElectionService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    // this.electionSubject = new BehaviorSubject<Election[]>(this.getElections());
    // this.election = this.electionSubject.asObservable();
  }

  // Save new election to Election DB
  create(election: Election) {
    return this.http
      .post(`${environment.apiUrl}/v1/create`, election)
      .pipe(catchError(this.handleError('createElection', null)));
  }

  // Deploys election on the blockchain network
  // Alerts node server to create new channel and deploy smart contract based on election_id details
  deploy(electionId) {
    return this.http
      .post(`${environment.apiUrl}/v1/deploy`, electionId)
      .pipe(catchError(this.handleError('deploy', null)));
  }

  // Retrieve all elections
  getAllElections(): Observable<Election[]> {
    return this.http
      .get<Election[]>(`${environment.apiUrl}/v1/election/`)
      .pipe(catchError(this.handleError('getAllElections', [])));
  }

  // Retrieve election by id
  getElection(electionId: string): Observable<Election> {
    return this.http
      .get<Election>(`${environment.apiUrl}/v1/election/${electionId}`)
      .pipe(catchError(this.handleError('getElection', null)));
  }

  // update(id, params) {
  //     return this.http.put(`${environment.apiUrl}/election/${id}`, params)
  //         .pipe(map(x => {
  //             // update stored user if the logged in user updated their own record
  //             if (id == this.userValue.id) {
  //                 // update local storage
  //                 const user = { ...this.userValue, ...params };
  //                 localStorage.setItem('user', JSON.stringify(user));

  //                 // publish updated user to subscribers
  //                 this.userSubject.next(user);
  //             }
  //             return x;
  //         }));
  // }

  // Update locked flag to 2 to indicate deleted
  // delete(id: string) {
  //     return this.http.delete(`${environment.apiUrl}/users/${id}`)
  //         .pipe(map(x => {
  //             // auto logout if the logged in user deleted their own record
  //             if (id == this.userValue.id) {
  //                 this.logout();
  //             }
  //             return x;
  //         }));
  // }

  // TODO - alert errors to display on election pages
  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.

      return of(result as T);
      //   return throwError(`${operation} failed: ${error.message}`);
    };
  }
}
