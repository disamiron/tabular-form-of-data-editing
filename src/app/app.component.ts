import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { UsersService } from './services/users/users.service';
import { StorageType } from './services/storage/storage.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TableFormOfDataEdit';
  constructor(
    private _userService: UsersService,
    private _storageService: StorageService
  ) {}

  public ngOnInit(): void {
    console.log(this._storageService.getItem(StorageType.Users));
    if (!this._storageService.getItem(StorageType.Users)) {
      this._userService
        .getUsers()
        .pipe(untilDestroyed(this))
        .subscribe((v) => {
          this._storageService.setItem(StorageType.Users, v.users);
        });
    }
  }
}
