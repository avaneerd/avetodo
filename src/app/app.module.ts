import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TodoService } from './todo.service';

import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoItemListComponent } from './todo-item-list/todo-item-list.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    TodoItemComponent,
    TodoItemListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
