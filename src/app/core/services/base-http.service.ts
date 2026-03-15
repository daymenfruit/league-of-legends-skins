import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import * as qs from 'qs';

export interface HttpCustomConfig {
  needSuccessInfo?: boolean;
  showLoading?: boolean;
  otherUrl?: boolean;
}

export interface ActionResult<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {

  protected constructor(private http: HttpClient) {
  }

  get<T>(path: string, param?: any, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http.get<ActionResult<T>>(reqPath, { params }).pipe(this.resultHandle<T>(config));
  }

  delete<T>(path: string, param?: any, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http.delete<ActionResult<T>>(reqPath, { params }).pipe(this.resultHandle<T>(config));
  }

  post<T>(path: string, param?: any, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    return this.http.post<ActionResult<T>>(reqPath, param).pipe(this.resultHandle<T>(config));
  }

  put<T>(path: string, param?: any, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    return this.http.put<ActionResult<T>>(reqPath, param).pipe(this.resultHandle<T>(config));
  }

  downLoadWithBlob(path: string, param?: any, config?: HttpCustomConfig): Observable<any> {
    config = config || { needSuccessInfo: false };
    const reqPath = this.getUrl(path, config);
    return this.http.post(reqPath, param, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUrl(path: string, config: HttpCustomConfig): string {
    // let reqPath = this.uri + path;
    let reqPath = path;
    if (config.otherUrl) {
      reqPath = path;
    }
    return reqPath;
  }

  resultHandle<T>(config: HttpCustomConfig): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter(item => {
          return this.handleFilter(item, !!config.needSuccessInfo);
        }),
        map(item => {
          return item.data;
        })
      );
    };
  }

  handleFilter<T>(item: ActionResult<T>, needSuccessInfo: boolean): boolean {
    return true;
  }
}
