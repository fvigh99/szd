import { Routes } from '@angular/router';
import { HomeComponent } from '../../libs/essentials/home/home.component';
import { TrainerListComponent } from 'libs/essentials/trainer-list/trainer-list.component';
import { MachineListComponent } from 'libs/essentials/machine-list/machine-list.component';
import { AchievementsComponent } from 'libs/essentials/achievements/achievements.component';
import { UserListComponent } from 'libs/essentials/user-list/user-list.component';

export const routes: Routes = [
  { path: 'page/home', component: HomeComponent },
  { path: 'page/trainer-list', component: TrainerListComponent },
  { path: 'page/machine-list', component: MachineListComponent },
  { path: 'page/achievements', component: AchievementsComponent },
  { path: 'page/user-list', component: UserListComponent },
];
