import { TodoItem } from './TodoItem';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoService {
  private todoItems: Array<TodoItem>;

  constructor() {
    const ti = new TodoItem();
    ti.title = 'A test todo item';
    ti.description = 'This is a description for my todo item.';
    ti.createdOn = new Date();
    ti.priority = 1;

    this.todoItems = [ti];
  }
}
