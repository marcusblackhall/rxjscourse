import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private user = new BehaviorSubject<User>(null);

  user$:Observable<User> = this.user.asObservable();
  isLoggedIn$ :Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

constructor(private http:HttpClient){
  this.isLoggedIn$ = this.user$.pipe(

      map(user => !!user)
  );

  this.isLoggedOut$ = this.isLoggedIn$.pipe(
    map(loggedIn => !loggedIn)
  );

  const userData = localStorage.getItem(AUTH_DATA);
  if (userData){
           const userStr = JSON.parse(userData);
           this.user.next(userStr);
  }

}

  login(email: string, password:string) :Observable<User>{

      return this.http.post<User>("/api/login",{email,password})
      .pipe(
        tap(loggedInUser => { this.user.next(loggedInUser);
          localStorage.setItem(AUTH_DATA,JSON.stringify(loggedInUser));
        }),
        shareReplay()
      );

  }

  logout(){
      this.user.next(null);
      localStorage.removeItem(AUTH_DATA);
  }

}
