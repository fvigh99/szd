import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Schedule, User } from 'libs/model/FcServerModel';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from 'libs/data-access/schedule/schedule.service';
import { Observable } from 'rxjs';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'fc-trainer-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, AsyncPipe],
  templateUrl: './trainer-schedule.component.html',
  styleUrl: './trainer-schedule.component.scss',
})
export class TrainerScheduleComponent implements OnInit {
  @Input() public trainer: User;
  public scheduleList: Observable<Schedule>;
  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.scheduleList = this.scheduleService.fetch();
  }
}
