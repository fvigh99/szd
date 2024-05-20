import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  afterNextRender,
  afterRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'libs/environments/environment';
import { User, UserSessionObject } from 'libs/model/FcServerModel';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<UserSessionObject>;
  public user: Observable<UserSessionObject>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): Observable<UserSessionObject> {
    return this.user;
  }

  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string; user_object: User; message: string }>(
        `${environment.apiUrl}/authentication/login`,
        {
          username,
          password,
        }
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    // should return that we are not logged in
  }
  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }
}
