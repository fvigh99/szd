import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { QueryDataService } from './QueryDataService';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class DataService<T> extends QueryDataService<T> {
  protected http: HttpClient;
  protected specUrlPart: string;
  private emptyInstance: T;
  protected headers = new HttpHeaders({
    'Content-Type': 'json; charset=utf-8',
  });

  public fetch(): Observable<T> {
    return this.http
      .get<T>(`${this.host}/${this.specUrlPart}`)
      .pipe(map((item) => item));
  }

  public create(element: T) {
    return this.http.post(`${this.host}/${this.specUrlPart}`, element);
  }
}
