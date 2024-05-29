import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PersonalGoalService } from 'libs/data-access/personal-goal/personal-goal.service';
import { AccountService } from 'libs/data-access/account/account.service';
import { PersonalGoal, User } from 'libs/model/FcServerModel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'fc-personal-goals',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputNumberModule,
    TableModule,
  ],
  templateUrl: './personal-goals.component.html',
  styleUrl: './personal-goals.component.css',
})
export class PersonalGoalsComponent implements OnInit {
  public loggedInUser: User;
  public ownPersonalGoal: PersonalGoal;
  public newPersonalGoalDialog = false;
  public newPersonalGoal: PersonalGoal;
  public editPersonalGoalDialog = false;
  public uniqueTrainingPlan: string;
  constructor(
    private personalGoalService: PersonalGoalService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
  }

  public fetchData(): void {
    this.personalGoalService
      .getByUserId(this.loggedInUser?.id)
      .subscribe((result) => {
        this.ownPersonalGoal = result;
        let difference =
          this.ownPersonalGoal.currentWeight - this.ownPersonalGoal.goalWeight;
        if (difference > 50) {
          this.uniqueTrainingPlan = '1.xls';
        } else if (difference > 25) {
          this.uniqueTrainingPlan = '2.xlsx';
        } else if (difference > 5) {
          this.uniqueTrainingPlan = '3.xls';
        } else if (difference > -5) {
          this.uniqueTrainingPlan = '4.xls';
        } else {
          this.uniqueTrainingPlan = '5.xls';
        }
      });
  }

  public showNewPersonalGoal(): void {
    this.newPersonalGoal = {};
    this.newPersonalGoalDialog = true;
  }

  public hideNewDialog(): void {
    this.newPersonalGoal = {};
    this.newPersonalGoalDialog = false;
  }

  public saveNewPersonalGoal(): void {
    this.newPersonalGoal.currentWeight = this.newPersonalGoal.startWeight;
    this.newPersonalGoal.user = this.loggedInUser;
    this.personalGoalService.create(this.newPersonalGoal).subscribe(() => {
      this.newPersonalGoalDialog = false;
      this.newPersonalGoal = {};
      this.fetchData();
    });
  }

  public showEditPersonalGoal(): void {
    this.editPersonalGoalDialog = true;
  }

  public hideEditDialog(): void {
    this.editPersonalGoalDialog = false;
    this.fetchData();
  }

  public saveEditedPersonalGoal(): void {
    this.personalGoalService.save(this.ownPersonalGoal).subscribe(() => {
      this.editPersonalGoalDialog = false;
      this.fetchData();
    });
  }

  public downloadExerciseSuggestion(): void {
    console.log(this.uniqueTrainingPlan);
    let difference =
      this.ownPersonalGoal.currentWeight - this.ownPersonalGoal.goalWeight;
    if (difference > 50) {
      this.uniqueTrainingPlan = '1.xls';
    } else if (difference > 25) {
      this.uniqueTrainingPlan = '2.xlsx';
    } else if (difference > 5) {
      this.uniqueTrainingPlan = '3.xls';
    } else if (difference > -5) {
      this.uniqueTrainingPlan = '4.xls';
    } else {
      this.uniqueTrainingPlan = '5.xls';
    }
  }
}
