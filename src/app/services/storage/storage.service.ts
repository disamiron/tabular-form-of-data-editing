import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../users/users.service.type';
import { Storage, StorageType } from './storage.type';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public storageChange$ = new Subject<Storage>();

  public setItem(type: StorageType, value: any, withoutNewId?: boolean): void {
    if (type === StorageType.Users && !withoutNewId) {
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
    id: number | null,
    name: string,
    email: string,
    phone: string
  ): void {
    let users: User[] = this.getItem(StorageType.Users);
    if (id) {
      users.forEach((user) => {
        if (user.id === id) {
          user.name = name.split(' ')[0];
          user.surname = name.split(' ')[1];
          user.email = email;
          user.phone = phone;
        }
      });
    } else {
      let newId;
      if (users.length) {
        const idArray: number[] = [];
        users.forEach((user) => {
          if (user.id) {
            idArray.push(user.id);
          }
        });
        newId = Math.max(...idArray) + 1;
      } else {
        newId = 1;
      }
      users.unshift({
        id: newId,
        name: name.split(' ')[0],
        surname: name.split(' ')[1],
        email: email,
        phone: phone,
      });
    }

    this.setItem(StorageType.Users, users, true);
  }

  public removeUsers(usersArrayId: number[]) {
    let newUsersArray: User[] = this.getItem(StorageType.Users);
    this.setItem(
      StorageType.Users,
      newUsersArray.filter((user) => !usersArrayId.includes(user.id!)),
      true
    );
  }
}
