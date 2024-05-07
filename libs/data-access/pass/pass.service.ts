import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { Pass } from 'libs/model/FcServerModel';

@Injectable({
  providedIn: 'root',
})
export class PassService extends DataService<Pass> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'passes';
  }

  public save(pass: Pass) {
    return this.http.put(`${this.host}/${this.specUrlPart}/${pass.id}`, pass);
  }
}
