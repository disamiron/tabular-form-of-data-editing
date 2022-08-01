/* eslint-disable no-restricted-syntax */
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/services/users/users.service.type';
import { MatPaginator } from '@angular/material/paginator';
import { ResizeEvent } from 'angular-resizable-element';
import { StorageService } from 'src/app/services/storage/storage.service';
import { StorageType } from 'src/app/services/storage/storage.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() userScope: User[] = [];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public addUserMode: boolean = false;

  public widthTable: { [key: string]: number } = {
    user: 200,
    mail: 200,
    phone: 200,
  };

  public minWidth: number = 150;

  public maxWidth: number = 600;

  public editUserId: number | null = null;

  public removeArray: number[] = [];

  public columnsToDisplay = ['checkbox', 'users', 'mail', 'phone', 'edit'];

  public form: FormGroup = this._fb.group({
    user: [
      null,
      [Validators.required, Validators.pattern(/^[А-Яа-я]+\s[А-Яа-я]+$/)],
    ],
    email: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^\+[7][0-9]{10}$/)],
    ],
  });

  public get fullRemoveArray() {
    return (
      this.dataSource.data.filter((user) => user.id).length ===
        this.removeArray.length &&
      !!this.dataSource.data.filter((user) => user.id).length
    );
  }

  public get partRemoveArray() {
    return (
      this.dataSource.data.filter((user) => user.id).length >
        this.removeArray.length && this.removeArray.length > 0
    );
  }

  constructor(
    private _storageService: StorageService,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.dataSource.data = this.userScope;
    if (this._storageService.getItem(StorageType.TableWidth)) {
      this.widthTable = this._storageService.getItem(StorageType.TableWidth);
    }
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Строк на странице';
  }

  public onResizeEnd(event: ResizeEvent, tab: string): void {
    if (event.edges.right) {
      const resultWidth = this.widthTable[tab] + Number(event.edges.right);
      if (resultWidth > this.maxWidth) {
        this.widthTable[tab] = this.maxWidth;
        this._storageService.setItem(StorageType.TableWidth, this.widthTable);
        return;
      }
      if (resultWidth < this.minWidth) {
        this.widthTable[tab] = this.minWidth;
        this._storageService.setItem(StorageType.TableWidth, this.widthTable);
        return;
      }

      this.widthTable[tab] = resultWidth;
      this._storageService.setItem(StorageType.TableWidth, this.widthTable);
    }
  }

  public editMode(userId: number) {
    if (this.addUserMode) {
      this.dataSource.data = this.dataSource.data.slice(1);
      this.addUserMode = false;
    }
    if (userId === this.editUserId) {
      this.editUserId = null;
      return;
    }

    this.editUserId = userId;
    const searchUser: User = this._storageService.getUserById(userId);
    this.form.patchValue({
      user: searchUser.name + ' ' + searchUser.surname,
      ...searchUser,
    });
  }

  public saveChanges() {
    this._storageService.saveUser(
      this.editUserId!,
      this.form.value.user,
      this.form.value.email,
      this.form.value.phone
    );
    this.addUserMode = false;
    this.editMode(this.editUserId!);
    this.dataSource.data = this._storageService.getItem(StorageType.Users);
  }

  public addUser(): void {
    this.addUserMode = true;
    this.editUserId = null;
    this.dataSource.data = [
      {
        id: null,
      },
      ...this.dataSource.data,
    ];
    this.form.patchValue({
      user: null,
      email: null,
      phone: null,
    });
  }

  public addToRemoveArray(id: number, event: boolean) {
    if (event) {
      this.removeArray.push(id);
    } else {
      const removeIndex = this.removeArray.findIndex((ids) => ids === id);
      this.removeArray.splice(removeIndex, 1);
    }
  }

  public addAllToremoveArray(event: boolean) {
    this.removeArray = [];
    if (event) {
      this.dataSource.data.forEach((user) => {
        if (user.id) {
          this.removeArray.push(user.id);
        }
      });
    }
  }

  public removeUsers() {
    if (this.removeArray.length) {
      this._storageService.removeUsers(this.removeArray);
      this.removeArray = [];
      this.dataSource.data = this._storageService.getItem(StorageType.Users);
    }
  }

  public removeConfirm() {
    if (!this.removeArray.length) {
      return;
    }
    this._dialog
      .open(DialogComponent, {
        data: {
          arrayRemoveCounter: this.removeArray.length,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((v) => {
        if (v === 'confirm') {
          this.removeUsers();
        }
      });
  }
}
