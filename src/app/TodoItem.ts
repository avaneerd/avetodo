export class TodoItem {
    /** The id of the todo item */
    id: number;

    /** The title of the todo item */
    title: string;

    /** The description of the todo item */
    description: string;

    /** The priority of the todo item */
    priority: number;

    /** The date of when the todo item was created */
    createdOn: Date;

    /** The date of when the todo item was completed, null if not completed yet */
    completedOn: Date;
}