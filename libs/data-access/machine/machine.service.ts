import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'libs/model/DataService';
import { Machine } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MachineService extends DataService<Machine> {
  constructor(http: HttpClient) {
    super();
    this.http = http;
    this.specUrlPart = 'machines';
  }

  public save(machine: Machine) {
    return this.http.put(
      `${this.host}/${this.specUrlPart}/${machine.id}`,
      machine
    );
  }

  public getByFlag(flag: string) {
    return this.http.get<Machine[]>(
      `${this.host}/${this.specUrlPart}/flag/${flag}`
    );
  }
}
