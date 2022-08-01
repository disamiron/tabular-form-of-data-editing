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

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() userScope: User[] = [];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public widthTable: { [key: string]: number } = {
    user: 200,
    mail: 200,
    phone: 200,
  };

  public minWidth: number = 150;
  public maxWidth: number = 600;

  public editUserId: number | null = null;

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

  constructor(
    private _storageService: StorageService,
    private _fb: FormBuilder
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
    this.editMode(this.editUserId!);
    this.dataSource.data = this._storageService.getItem(StorageType.Users);
  }
}
