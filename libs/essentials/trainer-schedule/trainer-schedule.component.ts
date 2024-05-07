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
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

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
  public dayList: Array<{ id: number; day: string }> = [
    { id: 0, day: 'Hétfő' },
    { id: 1, day: 'Kedd' },
    { id: 2, day: 'Szerda' },
    { id: 3, day: 'Csütörtök' },
    { id: 4, day: 'Péntek' },
    { id: 5, day: 'Szombat' },
    { id: 6, day: 'Vasárnap' },
  ];
  constructor(
    private scheduleService: ScheduleService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.scheduleList = this.scheduleService.getById(this.trainer.id);
  }

  public scheduleClosed() {
    this.dialogClosed.emit(false);
  }

  public openNew() {
    this.newScheduleDialog = true;
  }

  public hideEditedDialog() {
    this.newScheduleDialog = false;
  }

  public saveSchedule() {}
}
