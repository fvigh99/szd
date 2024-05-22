import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { Achievement } from 'libs/model/FcServerModel';

@Injectable({
  providedIn: 'root',
})
export class AchievementService extends DataService<Achievement> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'achievements';
  }

  public save(achievement: Achievement) {
    return this.http.put(
      `${this.host}/${this.specUrlPart}/${achievement.id}`,
      achievement
    );
  }
}
