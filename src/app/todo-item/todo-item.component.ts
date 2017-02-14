import { TodoItem } from './../TodoItem';
import { TodoService } from './../todo.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input() todoItem: TodoItem;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  completeItem() {
    this.todoItem.completedOn = new Date();

    this.todoService.editTodoItem(this.todoItem.id, this.todoItem)
      .then(null,
      () => {
        alert('Failed saving changes');
        this.todoItem.completedOn = null;
      });
  }
}
