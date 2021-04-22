import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '@environments';
import { Ballot } from '@app/model/ballot';

@Injectable()
export class BallotService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
  }

  // Retrieve all elections
  getCandidatesByElection(electionId: string): Observable<Ballot> {
    return this.http
      .get<Ballot>(`${environment.apiUrl}/v1/candidates/${electionId}`)
      .pipe(catchError(this.handleError('getCandidatesByElection', null)));
  }

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
