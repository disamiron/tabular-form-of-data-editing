import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TableComponent } from './modules/table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizableModule } from 'angular-resizable-element';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [AppComponent, TableComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    ResizableModule,
    CdkTableModule,
  ],
  exports: [
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
