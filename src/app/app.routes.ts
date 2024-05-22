import { Routes } from '@angular/router';
import { HomeComponent } from '../../libs/essentials/home/home.component';
import { TrainerListComponent } from 'libs/essentials/trainer-list/trainer-list.component';
import { MachineListComponent } from 'libs/essentials/machine-list/machine-list.component';
import { AchievementsComponent } from 'libs/essentials/achievements/achievements.component';
import { UserListComponent } from 'libs/essentials/user-list/user-list.component';
import { PreviousExercisesComponent } from 'libs/essentials/previous-exercises/previous-exercises.component';
import { PassListComponent } from 'libs/essentials/pass-list/pass-list.component';
import { MyScheduleComponent } from 'libs/essentials/my-schedule/my-schedule.component';
import { PersonalGoalsComponent } from 'libs/essentials/personal-goals/personal-goals.component';

export const routes: Routes = [
  { path: 'page/home', component: HomeComponent },
  { path: 'page/trainer-list', component: TrainerListComponent },
  { path: 'page/machine-list', component: MachineListComponent },
  { path: 'page/achievements', component: AchievementsComponent },
  { path: 'page/user-list', component: UserListComponent },
  { path: 'page/previous-exercises', component: PreviousExercisesComponent },
  { path: 'page/pass-list', component: PassListComponent },
  { path: 'page/my-schedule', component: MyScheduleComponent },
  { path: 'page/achievements', component: AchievementsComponent },
  { path: 'page/personal-goals', component: PersonalGoalsComponent },
];
