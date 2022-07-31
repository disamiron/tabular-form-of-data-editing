import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { TableComponent } from './modules/table/table.component';

@NgModule({
  declarations: [AppComponent, TableComponent],
  imports: [BrowserModule, HttpClientModule, MatTableModule],
  exports: [MatTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
