import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { PersonalGoal } from 'libs/model/FcServerModel';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalGoalService extends DataService<PersonalGoal> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'personal-goals';
  }

  public getByUserId(id: number): Observable<PersonalGoal> {
    return this.http
      .get<PersonalGoal>(`${this.host}/${this.specUrlPart}/getByUserId/${id}`)
      .pipe(map((personalGoals) => personalGoals));
  }

  public save(personalGoal: PersonalGoal) {
    return this.http.put(
      `${this.host}/${this.specUrlPart}/${personalGoal.id}`,
      personalGoal
    );
  }
}
