import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import {
  DisplayableSchedule,
  Schedule,
  ScheduleWithTime,
} from 'libs/model/FcServerModel';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends DataService<Schedule> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'schedules';
  }

  public getByTrainerId(id: number): Observable<ScheduleWithTime[]> {
    return this.http
      .get<ScheduleWithTime[]>(
        `${this.host}/${this.specUrlPart}/getByTrainerId/${id}`
      )
      .pipe(map((schedules) => schedules));
  }

  public save(schedule: Schedule) {
    return this.http.put(
      `${this.host}/${this.specUrlPart}/${schedule.id}`,
      schedule
    );
  }

  public generateDisplayableSchedule(
    schedules: ScheduleWithTime[]
  ): Observable<DisplayableSchedule[]> {
    let displayableScheduleList: DisplayableSchedule[] = new Array();
    let displayableSchedule: DisplayableSchedule = {};
    schedules.forEach((schedule) => {
      switch (schedule.day) {
        case 0:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.monday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.monday
            )[0].monday = schedule;
          } else {
            displayableSchedule.monday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 1:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.tuesday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.tuesday
            )[0].tuesday = schedule;
          } else {
            displayableSchedule.tuesday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 2:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.wednesday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.wednesday
            )[0].wednesday = schedule;
          } else {
            displayableSchedule.wednesday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 3:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.thursday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.thursday
            )[0].thursday = schedule;
          } else {
            displayableSchedule.thursday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 4:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.friday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.friday
            )[0].friday = schedule;
          } else {
            displayableSchedule.friday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 5:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.saturday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.saturday
            )[0].saturday = schedule;
          } else {
            displayableSchedule.saturday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
        case 6:
          if (
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.sunday
            ).length > 0
          ) {
            displayableScheduleList.filter(
              (displayableSchedule) => !displayableSchedule.sunday
            )[0].sunday = schedule;
          } else {
            displayableSchedule.sunday = schedule;
            displayableScheduleList.push(displayableSchedule);
            displayableSchedule = {};
          }
          break;
      }
    });
    return of(displayableScheduleList);
  }
}
