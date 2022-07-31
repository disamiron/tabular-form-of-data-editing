import { Injectable } from '@angular/core';
import { User } from './service.type';
import { HttpClient } from '@angular/common/http';

const COMPANIES_URL = '/companies';

@Injectable({
  providedIn: 'root',
})
export class GetService {
  constructor(private http: HttpClient) {}
  configUrl = 'http://87.242.76.45/testdata.json';

  public getConfig() {
    return this.http.get<User[]>(this.configUrl);
  }
}
