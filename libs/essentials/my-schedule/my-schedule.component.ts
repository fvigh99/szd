import { AccountService } from './../../data-access/account/account.service';
import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import { Schedule, User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fc-my-schedule',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ToastModule,
    NgIf,
    AsyncPipe,

  ],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss',
})
export class MyScheduleComponent implements OnInit {
  public loggedInUser: User | null;
  public ownSchedule: Observable<Schedule>;
  constructor(private scheduleService: ScheduleService, private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
  }

  public fetchData() {
   this.ownSchedule = this.scheduleService.getTrainerById(this.loggedInUser.id);
  }
}
