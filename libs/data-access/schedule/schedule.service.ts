import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { Schedule } from 'libs/model/FcServerModel';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends DataService<Schedule> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'schedules';
  }

  public getTrainerById(id: number): any {
    return this.http
      .get(`${this.host}/${this.specUrlPart}/getByTrainerId/${id}`)
      .pipe(map((element) => element));
  }
}
