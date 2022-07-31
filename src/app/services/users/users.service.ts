import { Injectable } from '@angular/core';
import { User } from './users.service.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  public configUrl = 'http://87.242.76.45/testdata.json';

  public getUsers() {
    return this.http.get<{ users: User[] }>(this.configUrl);
  }
}
