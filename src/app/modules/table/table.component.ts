/* eslint-disable no-restricted-syntax */
import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/services/users/users.service.type';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() userScope: MatTableDataSource<User[]> = new MatTableDataSource();

  public columnsToDisplay = ['users', 'mail', 'phone'];
  constructor() {}
}
