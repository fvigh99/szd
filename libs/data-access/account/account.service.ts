import { HttpClient } from '@angular/common/http';
import { Injectable, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'libs/environments/environment';
import { User } from 'libs/model/FcServerModel';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<{
    access_token: string;
    user_object: User;
    message: string;
  }>;
  public user: Observable<{
    access_token: string;
    user_object: User;
    message: string;
  }>;

  constructor(private router: Router, private http: HttpClient) {
    afterNextRender(() => {
      this.userSubject = new BehaviorSubject(
        JSON.parse(localStorage.getItem('user')!)
      );
      this.user = this.userSubject.asObservable();
    });
  }

  public get userValue() {
    return this.userSubject.value;
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

  update(id: number, params: any) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map((x) => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue?.user_object.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue?.user_object.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
