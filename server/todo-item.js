function TodoItem(_id, title, description, priority, createdOn, completedOn) {
    /** The id of the todo item */
    this._id = _id;

    /** The title of the todo item */
    this.title = title;

    /** The description of the todo item */
    this.description = description;

    /** The priority of the todo item */
    this.priority = priority;

    /** The date of when the todo item was created */
    this.createdOn = createdOn;

    /** The date of when the todo item was completed, null if not completed yet */
    this.completedOn = completedOn;
}

module.exports = TodoItem;