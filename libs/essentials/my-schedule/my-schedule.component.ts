import { AccountService } from './../../data-access/account/account.service';
import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import {
  Day,
  DisplayableSchedule,
  Schedule,
  ScheduleWithTime,
  User,
} from 'libs/model/FcServerModel';
import { Observable, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fc-my-schedule',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    NgIf,
    AsyncPipe,
    DialogModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    ToolbarModule,
    InputNumberModule,
    CalendarModule,
    NgFor,
    CheckboxModule,
  ],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss',
})
export class MyScheduleComponent implements OnInit {
  public loggedInUser: User | null;
  public ownSchedule: Observable<ScheduleWithTime[]>;
  public newSchedule: Schedule;
  public newScheduleDialog = false;
  public editScheduleDialog = false;
  public editedSchedule: Schedule;
  public displayableScheduleList: Observable<DisplayableSchedule[]>;
  public dayList: Array<Day> = [
    { id: 0, name: 'Hétfő' },
    { id: 1, name: 'Kedd' },
    { id: 2, name: 'Szerda' },
    { id: 3, name: 'Csütörtök' },
    { id: 4, name: 'Péntek' },
    { id: 5, name: 'Szombat' },
    { id: 6, name: 'Vasárnap' },
  ];
  public groupTrainingTypeList: Array<string> = [
    'kickbox',
    'spinracing',
    'pilates',
    'yoga',
  ];
  constructor(
    private scheduleService: ScheduleService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
  }

  public fetchData() {
    this.scheduleService
      .getByTrainerId(this.loggedInUser?.id)
      .pipe(
        tap((schedules) => {
          schedules.forEach((schedule) => {
            schedule.startTime =
              new Date(schedule.start).toLocaleTimeString().split(':')[0] +
              ':' +
              new Date(schedule.start).toLocaleTimeString().split(':')[1];
            schedule.endTime =
              new Date(schedule.end).toLocaleTimeString().split(':')[0] +
              ':' +
              new Date(schedule.end).toLocaleTimeString().split(':')[1];
          });
          this.displayableScheduleList =
            this.scheduleService.generateDisplayableSchedule(schedules);
        })
      )
      .subscribe();
  }

  public openNew(): void {
    this.newScheduleDialog = true;
    this.newSchedule = {
      trainer: this.loggedInUser,
    };
  }

  public hideNewDialog(): void {
    this.newScheduleDialog = false;
  }

  public saveNewSchedule(): void {
    this.scheduleService.create(this.newSchedule).subscribe(() => {
      this.messageService.add({
        summary: 'Siker!',
        severity: 'success',
        detail: 'Sikeres mentés!',
      });
      this.fetchData();
    });
    this.newScheduleDialog = false;
    this.newSchedule = null;
  }

  public editSchedule(schedule: ScheduleWithTime) {
    if (schedule) {
      this.editScheduleDialog = true;
      this.editedSchedule = schedule;
      this.editedSchedule.start = new Date(this.editedSchedule.start);
      this.editedSchedule.end = new Date(this.editedSchedule.end);
    }
  }

  public hideEditedDialog(): void {
    this.editScheduleDialog = false;
  }
  public saveEditedSchedule(): void {
    this.scheduleService.save(this.editedSchedule).subscribe(() => {
      this.messageService.add({
        summary: 'Siker!',
        severity: 'success',
        detail: 'Sikeres módosítás!',
      });
      this.fetchData();
    });
    this.editScheduleDialog = false;
  }
  public deleteSchedule(): void {
    this.editScheduleDialog = false;
  }
}
