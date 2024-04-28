import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { User } from 'libs/model/FcServerModel';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DataService<User> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'users';
  }

  public save(user: User) {
    return this.http.put(`${this.host}/${this.specUrlPart}/${user.id}`, user);
  }

  public getTrainers(): any {
    return this.http
      .get(`${this.host}/${this.specUrlPart}/getRole`)
      .pipe(map((element) => element));
  }
}
