import { TodoItem } from './../todo-item';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-item-list',
  templateUrl: './todo-item-list.component.html',
  styleUrls: ['./todo-item-list.component.css']
})
export class TodoItemListComponent implements OnInit {
  @Input() todoItems: Array<TodoItem>;

  constructor() { }

  ngOnInit() {
  }

}
