var TodoItem = require('./todo-item');
var Datastore = require('nedb');

function TodoItemStore() {
    var db = new Datastore({ filename: 'todo-items.db', autoload: true });
}

TodoItemStore.prototype.getOpenTodoItem = function () {
    return new Promise(function (resolve, reject) {
        // Get items where createdOn is null and sort by priority descending.
        db.find({ createdOn: null }).sort({ priority: -1 }).exec(function (err, docs) {
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
};

module.exports = TodoItemStore;