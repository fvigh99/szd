import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Schedule, User } from 'libs/model/FcServerModel';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import { Observable } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccountService } from 'libs/data-access/account/account.service';

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
  constructor(
    private scheduleService: ScheduleService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    console.log(this.trainer.id);
    this.loggedInUser = this.accountService.userValue.user_object;
    this.scheduleList = this.scheduleService.getById(this.trainer.id);
  }

  public scheduleClosed() {
    this.dialogClosed.emit(false);
  }
}
