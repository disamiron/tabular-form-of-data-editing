import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { UsersService } from './services/users/users.service';
import { User } from './services/users/users.service.type';
import { StorageType } from './services/storage/storage.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableComponent } from './modules/table/table.component';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('carriersContainer') public carriersContainer!: ElementRef;

  @ViewChild(TableComponent) private _tableComponent!: TableComponent;

  title = 'TableFormOfDataEdit';

  public userScope: User[] = [];

  public isLoading: boolean = true;

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
          this.userScope = this._storageService.getItem(StorageType.Users);
          this.isLoading = false;
        });
    } else {
      this.userScope = this._storageService.getItem(StorageType.Users);
      this.isLoading = false;
    }
  }

  public addUser(): void {
    this._tableComponent.addUser();
  }

  public removeUsers(): void {
    this._tableComponent.removeConfirm();
  }
}
