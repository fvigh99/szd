import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { QueryDataService } from './QueryDataService';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class DataService<T> extends QueryDataService<T> {
  protected http: HttpClient;
  protected specUrlPart: string;
  protected searchedInstance: string;
  private emptyInstance: T;
  protected headers = new HttpHeaders({
    'Content-Type': 'json; charset=utf-8',
  });

  public fetch(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.host}/${this.specUrlPart}`)
      .pipe(map((item) => item));
  }

  public getById(id: number): Observable<T> {
    return this.http
      .get<T>(`${this.host}/${this.specUrlPart}/getId/${id}`)
      .pipe(map((item) => item));
  }

  public create(element: T) {
    return this.http.post(`${this.host}/${this.specUrlPart}`, element);
  }

  public delete(id: number): Observable<T> {
    return this.http
      .delete<T>(`${this.host}/${this.specUrlPart}/${id}`)
      .pipe(map((item) => item));
  }
}
