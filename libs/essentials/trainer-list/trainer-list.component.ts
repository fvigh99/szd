import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { UserService } from 'libs/data-access/user/user.service';
import { User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'fc-trainer-list',
  standalone: true,
  imports: [CommonModule, CarouselModule, AsyncPipe, NgIf],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss',
})
export class TrainerListComponent implements OnInit {
  public trainerList: Observable<User>;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getTrainers().subscribe();
  }
}
