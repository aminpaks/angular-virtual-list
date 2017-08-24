import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ListItemComponent } from './lists/list-item.component';
import { ListWithApiComponent } from './lists/list-with-api.component';
import { MultiColListComponent } from './lists/multi-col-list.component';
import { TableListComponent } from './lists/table-list.component';
import { TableLikeListComponent } from './lists/table-like-list.component';
import { VerticalListComponent } from './lists/vertical-list.component';

import { VirtualListModule } from 'angular-virtual-list';

@NgModule({
  declarations: [
    AppComponent,
    ListItemComponent,
    ListWithApiComponent,
    MultiColListComponent,
    TableListComponent,
    TableLikeListComponent,
    VerticalListComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    VirtualListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
