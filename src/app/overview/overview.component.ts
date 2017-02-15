import { TodoItem } from './../todo-item';
import { TodoService } from './../todo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  todoItems: Array<TodoItem>;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.getTodoItems()
      .then(items => this.todoItems = items,
        () => alert('Error loading todo items.'));
  }
}
