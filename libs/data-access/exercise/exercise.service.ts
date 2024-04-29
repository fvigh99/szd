import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { Exercise } from 'libs/model/FcServerModel';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService extends DataService<Exercise> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'exercises';
  }
}
