import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage, StorageType } from './storage.type';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public storageChange$ = new Subject<Storage>();

  public setItem(type: StorageType, value: any): void {
    localStorage.setItem(type, JSON.stringify(value));
    this.storageChange$.next({ type, value });
  }

  public getItem<T>(type: StorageType): T {
    const item = localStorage.getItem(type)!;

    return JSON.parse(item);
  }
}
