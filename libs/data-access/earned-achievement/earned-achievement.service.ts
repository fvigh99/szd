import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { EarnedAchievement } from 'libs/model/FcServerModel';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EarnedAchievementService extends DataService<EarnedAchievement> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'earned-achievements';
  }

  public getEarnedAchievementByUserId(id: number) {
    return this.http
      .get<EarnedAchievement[]>(`${this.host}/${this.specUrlPart}/userId/${id}`)
      .pipe(map((item) => item));
  }

  public getEarnedAchievementByAchievementId(id: number) {
    return this.http
      .get<EarnedAchievement[]>(
        `${this.host}/${this.specUrlPart}/achievementId/${id}`
      )
      .pipe(map((item) => item));
  }
}
