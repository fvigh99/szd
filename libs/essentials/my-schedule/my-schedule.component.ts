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
  UserInTraining,
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserInTrainingService } from 'libs/data-access/user-in-training/user-in-training.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    ConfirmDialogModule,
  ],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss',
})
export class MyScheduleComponent implements OnInit {
  public loggedInUser: User | null;
  public ownSchedule: Schedule[];
  public newSchedule: Schedule;
  public newScheduleDialog = false;
  public editScheduleDialog = false;
  public editedSchedule: Schedule;
  public displayableScheduleList: Observable<DisplayableSchedule[]>;
  public loggedInUserTrainingIds: number[] = new Array();
  public loggedInUserTrainings: UserInTraining[] = new Array();
  public usersInTrainingForSchedule: UserInTraining[] = new Array();
  public usersInTrainingDialog = false;
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
    private messageService: MessageService,
    private userInTrainingService: UserInTrainingService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
  }

  public fetchData() {
    this.displayableScheduleList = this.scheduleService
      .getByTrainerId(this.loggedInUser?.id)
      .pipe(
        switchMap((schedules) => {
          this.ownSchedule = schedules;
          this.ownSchedule.map((schedule) => {
            schedule.start = new Date(schedule.start);
            schedule.end = new Date(schedule.end);
            schedule.start = new Date(
              0,
              0,
              0,
              schedule.start.getHours(),
              schedule.start.getMinutes()
            );
            schedule.end = new Date(
              0,
              0,
              0,
              schedule.end.getHours(),
              schedule.end.getMinutes()
            );
          });
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
          return this.scheduleService.generateDisplayableSchedule(schedules);
        })
      );

    this.loggedInUserTrainingIds = new Array();
    this.userInTrainingService
      .getByUserId(this.loggedInUser?.id)
      .subscribe((result) => {
        if (result) {
          this.loggedInUserTrainings = result;
          result.forEach((userInTraining) => {
            this.loggedInUserTrainingIds.push(userInTraining.schedule.id);
          });
        }
      });

    this.userInTrainingService
      .getByScheduleId(this.editedSchedule.id)
      .subscribe((result) => {
        this.usersInTrainingForSchedule = result;
      });
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
    this.newSchedule.start = new Date(
      0,
      0,
      0,
      this.newSchedule.start.getHours(),
      this.newSchedule.start.getMinutes()
    );
    this.newSchedule.end = new Date(
      0,
      0,
      0,
      this.newSchedule.end.getHours(),
      this.newSchedule.end.getMinutes()
    );
    if (this.newSchedule.start < this.newSchedule.end) {
      if (!this.checkOverlappingSchedule(this.newSchedule)) {
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
      } else {
        this.messageService.add({
          summary: 'Hiba!',
          severity: 'error',
          detail:
            'Sikertelen mentés! Ez az időpont átfedésben van egy létező órájának időpontjával!',
        });
      }
    } else {
      this.messageService.add({
        summary: 'Hiba!',
        severity: 'error',
        detail:
          'Sikertelen mentés! Az edzés kezdete nem lehet hamarabb, mint az edzés vége!',
      });
    }
  }

  public checkOverlappingSchedule(checkedSchedule: Schedule): Schedule {
    return this.ownSchedule.find(
      (schedule) =>
        schedule.id !== checkedSchedule.id &&
        schedule.day === checkedSchedule.day &&
        (schedule.start.getTime() === checkedSchedule.start.getTime() ||
          schedule.end.getTime() === checkedSchedule.end.getTime() ||
          (schedule.start.getTime() <= checkedSchedule.start.getTime() &&
            schedule.end.getTime() >= checkedSchedule.end.getTime()) ||
          (schedule.start.getTime() >= checkedSchedule.start.getTime() &&
            schedule.end.getTime() <= checkedSchedule.end.getTime()) ||
          (schedule.end.getTime() >= checkedSchedule.start.getTime() &&
            schedule.start.getTime() <= checkedSchedule.start.getTime()) ||
          (schedule.end.getTime() >= checkedSchedule.end.getTime() &&
            schedule.start.getTime() <= checkedSchedule.end.getTime()))
    );
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
    this.fetchData();
  }

  public saveEditedSchedule(): void {
    this.editedSchedule.start = new Date(
      0,
      0,
      0,
      this.editedSchedule.start.getHours(),
      this.editedSchedule.start.getMinutes()
    );
    this.editedSchedule.end = new Date(
      0,
      0,
      0,
      this.editedSchedule.end.getHours(),
      this.editedSchedule.end.getMinutes()
    );
    if (this.editedSchedule.start <= this.editedSchedule.end) {
      if (!this.checkOverlappingSchedule(this.editedSchedule)) {
        this.scheduleService.save(this.editedSchedule).subscribe(() => {
          this.messageService.add({
            summary: 'Siker!',
            severity: 'success',
            detail: 'Sikeres módosítás!',
          });
          this.fetchData();
        });
        this.editScheduleDialog = false;
      } else {
        this.messageService.add({
          summary: 'Hiba!',
          severity: 'error',
          detail:
            'Sikertelen mentés! Ez az időpont átfedésben van egy létező órájának időpontjával!',
        });
      }
    } else {
      this.messageService.add({
        summary: 'Hiba!',
        severity: 'error',
        detail:
          'Sikertelen mentés! Az edzés kezdete nem lehet hamarabb, mint az edzés vége!',
      });
    }
  }
  public deleteSchedule(): void {
    this.confirmationService.confirm({
      message:
        'Biztosan törölni szeretné az órát? Ebben az esetben minden felhasználó lejelentkeztetésre kerül!',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.userInTrainingService
          .deleteMany(this.editedSchedule.id)
          .pipe(
            switchMap(() => {
              return this.scheduleService.delete(this.editedSchedule.id);
            })
          )
          .subscribe(() => {
            this.messageService.add({
              summary: 'Siker!',
              severity: 'success',
              detail: 'Sikeres törlés!',
            });
            this.fetchData();
            this.editScheduleDialog = false;
          });
      },
    });
  }

  public showUsersInTraining(): void {
    this.usersInTrainingDialog = true;
  }

  public hideUsersInTraining(): void {
    this.usersInTrainingDialog = false;
    this.fetchData();
  }

  public removeUserFromTraining(userInTraining: UserInTraining) {
    this.confirmationService.confirm({
      message: 'Biztosan le szeretné jelentkeztetni a tagot az edzésről?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.userInTrainingService.delete(userInTraining.id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'A tagot sikeresen lejelentkeztette az edzésről!',
          });
          this.fetchData();
        });
      },
    });
  }
}
