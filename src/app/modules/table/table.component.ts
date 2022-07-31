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

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() userScope: User[] = [];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public ngOnInit() {
    this.dataSource.data = this.userScope;
  }
  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Строк на странице';
  }

  public columnsToDisplay = ['checkbox', 'users', 'mail', 'phone', 'edit'];
}
