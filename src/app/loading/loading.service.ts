import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ : Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
console.log(" Contructed instance of Loading Service");

   }

  showUntilCompleted<T> (obs$:Observable<T>) :Observable<T>{
      return of(null)
      .pipe(
        tap(() => {
        this.turnedOn();

        }

        ),
        concatMap(() => obs$),
        finalize(() => this.turnedOff())
      );

  }

  turnedOn(){
      this.loadingSubject.next(true);
  }

  turnedOff(){
    this.loadingSubject.next(false);
  }
}
