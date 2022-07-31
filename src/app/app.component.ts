import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { UsersService } from './services/users/users.service';
import { User } from './services/users/users.service.type';
import { StorageType } from './services/storage/storage.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('carriersContainer') public carriersContainer!: ElementRef;
  title = 'TableFormOfDataEdit';

  public dataSource: MatTableDataSource<User[]> = new MatTableDataSource();

  public columnsToDisplay = ['users', 'mail', 'phone'];

  constructor(
    private _userService: UsersService,
    private _storageService: StorageService
  ) {}

  public ngOnInit(): void {
    if (!this._storageService.getItem(StorageType.Users)) {
      this._userService
        .getUsers()
        .pipe(untilDestroyed(this))
        .subscribe((v) => {
          this._storageService.setItem(StorageType.Users, v.users);
          this.dataSource.data = this._storageService.getItem(
            StorageType.Users
          );
        });
    } else {
      this.dataSource.data = this._storageService.getItem(StorageType.Users);
    }
  }
}
