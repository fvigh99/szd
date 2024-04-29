import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { UserService } from 'libs/data-access/user/user.service';
import { User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { TrainerScheduleComponent } from '../trainer-schedule/trainer-schedule.component';

@Component({
  selector: 'fc-trainer-list',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    AsyncPipe,
    NgIf,
    TrainerScheduleComponent,
  ],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss',
})
export class TrainerListComponent implements OnInit {
  public trainerList: Observable<User[]>;
  public scheduleOpen = false;
  public selectedTrainer: User;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.trainerList = this.userService.getTrainers();
  }

  public imageClicked(value: User) {
    this.selectedTrainer = value;
    this.scheduleOpen = true;
  }

  public scheduleClosed(value: boolean) {
    this.scheduleOpen = value;
  }
}
