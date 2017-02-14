import { TodoItem } from './TodoItem';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoService {
  private todoItems: Array<TodoItem>;
  private nextId = 0;

  constructor() {
    const ti = new TodoItem();
    ti.title = 'A test todo item';
    ti.description = 'This is a description for my todo item.';
    ti.createdOn = new Date();
    ti.priority = 1;
    ti.id = this.nextId++;

    this.todoItems = [ti];
  }

  /** Get all unarchived todo items */
  getTodoItems(): Promise<TodoItem[]> {
    return Promise.resolve(this.todoItems.filter(item => !item.completedOn));
  }

  /** Get all archived todo items */
  getArchivedTodoItems(): Promise<TodoItem[]> {
    return Promise.resolve(this.todoItems.filter(item => item.completedOn));
  }

  /** Get all unarchived todo items */
  getTodoItem(id: number): Promise<TodoItem> {
    return Promise.resolve(this.todoItems.find(item => item.id === id));
  }

  /** Add a todo item */  
  addTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    todoItem.id = this.nextId++;
    this.todoItems.push(todoItem);

    return Promise.resolve(todoItem);
  }

  /** edit a todo item */
  editTodoItem(id: number, todoItem: TodoItem): Promise<TodoItem> {
    const existingItem = this.todoItems.find(item => item.id === id);

    if (existingItem) {
      this.todoItems.splice(this.todoItems.indexOf(existingItem), 1);
    }

    todoItem.id = id;
    this.todoItems.push(todoItem);

    return Promise.resolve(todoItem);
  }

  /** delete a todo item */
  deleteTodoItem(id: number): Promise<void> {
    const existingItem = this.todoItems.find(item => item.id === id);

    if (existingItem) {
      this.todoItems.splice(this.todoItems.indexOf(existingItem), 1);
    }

    return Promise.resolve();
  }
}
