import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../users/users.service.type';
import { Storage, StorageType } from './storage.type';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public storageChange$ = new Subject<Storage>();

  public setItem(type: StorageType, value: any): void {
    if (type === StorageType.Users) {
      let id = 1;
      value.forEach((user: User) => {
        user.id = id;
        id += 1;
      });
    }

    localStorage.setItem(type, JSON.stringify(value));
    this.storageChange$.next({ type, value });
  }

  public getItem<T>(type: StorageType): T {
    const item = localStorage.getItem(type)!;

    return JSON.parse(item);
  }

  public getUserById<T>(id: number): T {
    const item = localStorage.getItem(StorageType.Users)!;
    const parseItem = JSON.parse(item);
    return parseItem.find((user: User) => user.id === id);
  }

  public saveUser<T>(
    id: number,
    name: string,
    email: string,
    phone: string
  ): void {
    let users: User[] = this.getItem(StorageType.Users);
    users.forEach((user) => {
      if (user.id === id) {
        user.name = name.split(' ')[0];
        user.surname = name.split(' ')[1];
        user.email = email;
        user.phone = phone;
      }
    });
    this.setItem(StorageType.Users, users);
  }
}
