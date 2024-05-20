import { AccountService } from './../../data-access/account/account.service';
import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import { Day, Schedule, User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';

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
  ],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss',
})
export class MyScheduleComponent implements OnInit {
  public loggedInUser: User | null;
  public ownSchedule: Observable<Schedule>;
  public newSchedule: Schedule;
  public newScheduleDialog = false;
  public dayList: Array<Day> = [
    { id: 0, name: 'Hétfő' },
    { id: 1, name: 'Kedd' },
    { id: 2, name: 'Szerda' },
    { id: 3, name: 'Csütörtök' },
    { id: 4, name: 'Péntek' },
    { id: 5, name: 'Szombat' },
    { id: 6, name: 'Vasárnap' },
  ];
  constructor(
    private scheduleService: ScheduleService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.user.subscribe((value) => {
      if (value && value.user_object) {
        this.loggedInUser = value.user_object;
      } else {
        this.loggedInUser = null;
      }
    });
    this.fetchData();
  }

  public fetchData() {
    this.ownSchedule = this.scheduleService.getTrainerById(
      this.loggedInUser?.id
    );
  }

  public openNew(): void {}

  public hideEditedDialog(): void {}

  public saveSchedule(): void {}
}
