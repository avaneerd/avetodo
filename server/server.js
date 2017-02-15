var TodoItem = require('./todo-item');
var express = require('express');
var TodoItemStore = require('./todo-item-store');

var todoItemStore = new TodoItemStore();
var app = express();

app.get('/', function (req, res) {
    todoItemStore.getOpenTodoItem()
        .then((todoItems) => res.send(todoItems), (err) => res.status(500).send(err));
});

app.listen(3000, function () {
    console.log('avetodo server running on http://localhost:3000');
});