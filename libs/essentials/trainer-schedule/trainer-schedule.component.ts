import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import {
  Day,
  DisplayableSchedule,
  Pass,
  Schedule,
  ScheduleWithTime,
  User,
  UserInTraining,
} from 'libs/model/FcServerModel';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import { Observable, map, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccountService } from 'libs/data-access/account/account.service';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { UserService } from 'libs/data-access/user/user.service';
import { UserInTrainingService } from 'libs/data-access/user-in-training/user-in-training.service';

@Component({
  selector: 'fc-trainer-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    AsyncPipe,
    DialogModule,
    ButtonModule,
    NgIf,
    ToolbarModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToolbarModule,
    CheckboxModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './trainer-schedule.component.html',
  styleUrl: './trainer-schedule.component.scss',
})
export class TrainerScheduleComponent implements OnInit {
  @Input() public trainer: User;
  @Output() public dialogClosed: EventEmitter<boolean> = new EventEmitter();
  public scheduleList: Observable<Schedule>;
  public dialogVisible = true;
  public loggedInUser: User;
  public newScheduleDialog = false;
  public newSchedule: Schedule;
  public displayableScheduleList: Observable<DisplayableSchedule[]>;
  public editScheduleDialog = false;
  public editedSchedule: Schedule;
  public currentUserPass: Pass;
  public currentUserCountInTraining: number;
  public loggedInUserTrainingIds: number[] = new Array();
  public loggedInUserTrainings: UserInTraining[] = new Array();
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
    private userService: UserService,
    private userInTrainingService: UserInTrainingService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    if (this.loggedInUser) {
      this.userService.getById(this.loggedInUser.id).subscribe((user) => {
        this.currentUserPass = user.pass;
      });
    }
    this.fetchData();
  }

  public fetchData() {
    this.displayableScheduleList = this.scheduleService
      .getByTrainerId(this.trainer?.id)
      .pipe(
        switchMap((schedules) => {
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
  }

  public scheduleClosed() {
    this.dialogClosed.emit(false);
  }
  public trainingClicked(schedule: Schedule) {
    if (
      this.loggedInUser &&
      (this.loggedInUser.role === 'ADMIN' || this.loggedInUser.role === 'TAG')
    ) {
      if (this.loggedInUser.role === 'ADMIN') {
        this.editSchedule(schedule);
      } else if (
        !schedule.inactive &&
        (schedule.attendanceCount !== schedule.capacity ||
          (this.loggedInUserTrainingIds &&
            this.loggedInUserTrainingIds.includes(schedule.id)))
      ) {
        if (
          this.loggedInUserTrainingIds &&
          !this.loggedInUserTrainingIds.includes(schedule.id)
        ) {
          this.confirmationService.confirm({
            message: 'Biztosan jelentkezni szeretne az edzésre?',
            header: 'Megerősítés',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Igen',
            rejectLabel: 'Nem',
            accept: () => {
              if (this.loggedInUser.role === 'TAG' && !this.currentUserPass) {
                this.messageService.add({
                  summary: 'Hiba!',
                  severity: 'error',
                  detail: 'Sikertelen jelentkezés! Nincs aktív bérlete!',
                });
              } else if (this.loggedInUser.role === 'TAG') {
                let insufficientPass = false;
                switch (schedule.type) {
                  case 'yoga':
                    insufficientPass = !this.currentUserPass?.yoga;
                    break;
                  case 'kickbox':
                    insufficientPass = !this.currentUserPass?.kickbox;
                    break;
                  case 'spinracing':
                    insufficientPass = !this.currentUserPass?.spinracing;
                    break;
                  case 'pilates':
                    insufficientPass = !this.currentUserPass?.pilates;
                    break;
                }
                if (insufficientPass) {
                  this.messageService.add({
                    summary: 'Hiba!',
                    severity: 'error',
                    detail:
                      'Sikertelen jelentkezés! Ilyen típusú edzésen nem vehet részt a bérletével!',
                  });
                } else {
                  this.userInTrainingService
                    .create({ schedule: schedule, user: this.loggedInUser })
                    .subscribe(() => {
                      this.messageService.add({
                        summary: 'Siker!',
                        severity: 'success',
                        detail: 'Sikeres jelentkezés!',
                      });
                    })
                    .add(() => {
                      this.fetchData();
                    });
                }
              }
            },
          });
        } else {
          this.confirmationService.confirm({
            message: 'Biztosan le szeretne jelentkezni az edzésről?',
            header: 'Megerősítés',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Igen',
            rejectLabel: 'Nem',
            accept: () => {
              this.userInTrainingService
                .delete(
                  this.loggedInUserTrainings[
                    this.loggedInUserTrainingIds.indexOf(schedule.id)
                  ].id
                )
                .subscribe((result) => {
                  if (result) {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Siker!',
                      detail: 'Sikeresen lejelentkezett az edzésről!',
                    });
                    this.fetchData();
                  }
                });
            },
          });
        }
      }
    }
  }

  public openNew(): void {
    this.newScheduleDialog = true;
    this.newSchedule = {
      trainer: this.trainer,
    };
  }

  public hideNewDialog(): void {
    this.newScheduleDialog = false;
  }

  public saveNewSchedule(): void {
    if (this.newSchedule.start < this.newSchedule.end) {
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
          'Sikertelen mentés! Az edzés kezdete nem lehet hamarabb, mint az edzés vége!',
      });
    }
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
    if (this.editedSchedule.start < this.editedSchedule.end) {
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
          'Sikertelen módosítás! Az edzés kezdete nem lehet hamarabb, mint az edzés vége!',
      });
    }
  }
}
