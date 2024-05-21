import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { UserInTraining } from 'libs/model/FcServerModel';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInTrainingService extends DataService<UserInTraining> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'users-in-training';
  }

  public getByScheduleId(id: number): Observable<UserInTraining[]> {
    return this.http
      .get<UserInTraining[]>(`${this.host}/${this.specUrlPart}/schedule/${id}`)
      .pipe(map((userInTraining) => userInTraining));
  }

  public getByUserId(id: number): Observable<UserInTraining[]> {
    return this.http
      .get<UserInTraining[]>(`${this.host}/${this.specUrlPart}/user/${id}`)
      .pipe(map((userInTraining) => userInTraining));
  }
}
