import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from 'libs/data-access/account/account.service';
import { AchievementService } from 'libs/data-access/achievement/achievement.service';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Achievement, Machine, User } from 'libs/model/FcServerModel';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    InputNumberModule,
  ],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class AchievementsComponent implements OnInit {
  public addAchievementDialog = false;
  public editAchievementDialog = false;
  public loggedInUser: User | undefined;
  public editedAchievement: Achievement;
  public achievementTypeList: string[];
  public machineList: Machine[];
  public groupTrainingTypeList: string[];
  constructor(
    private accountService: AccountService,
    private achievementService: AchievementService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
  }

  public fetchData(): void {}

  public hideEditedDialog(): void {}

  public saveEditedAchievement(): void {}

  public deleteAchievement() {}
}
