# avetodo
This project is for educational purposes with which I want to teach you the basics of Angular(2). It will also include a node server to persist data and to also get you familiar with communication from Angular with web services.

Following this training should teach you the following:
- Building an app with Angular 2 and Bootstrap 4.
- Building a node server with Express and NeDB.

This training assumes you have nodejs and git installed.

## 1. setting up the project

1. Install the Angular CLI tooling by running `npm install @angular/cli -g` from the commandline.  
   The `-g` option install the tooling as global, this means that from every command window you option that tooling will be available.  
   After installing the Angular CLI tooling you have the `ng` command available.
   
2. Goto to a folder where you store your sources and run the command `ng new avetodo`.  
   This will create a new folder named 'avetodo' in wich `ng init` will be run.  
   'ng init ' will create a angular boilerplate project and pull in the dependencies for it.
   
3. Go into the folder the folder was created and run `npm install jquery tether bootstrap@next --save`.  
   This will install bootstrap, tether and jquery as depedency for our project. The `--save` option` saves bootstrap as an depedency to `package.json`.
   
4. Next we need to make sure we can actually use bootstrap for our app. We do this by adding files needed to use bootstrap in the `angular-cli.json` file.  
   Open the `angular-cli.json` file and find the `scripts` and `styles` arrays in the file, change the content of both arrays as shown below:
   ```javascript
      "styles": [
        "./../node_modules/tether/dist/css/tether.css",
        "./../node_modules/bootstrap/dist/css/bootstrap.css",
        "styles.css"
      ],
      "scripts": [
        "./../node_modules/jquery/dist/jquery.js",
        "./../node_modules/tether/dist/js/tether.js",
        "./../node_modules/bootstrap/dist/js/bootstrap.js"
      ],
   ```
   When building the app the listed files should be taken into the build.
   
5. Now run `ng serve` to build and host the project, after it's done compiling you can go to `http://localhost:4200` to see an 'App works!' message.

## 2. Building the app

Now that we have our project setup we can go ahead and implement our app. 
To give our app a bit more complexity (both graphically and technically) I want our todo app to have:
- A title and description for todo items.
- Show date and time of creation and completion of todo items.
- Show archived (completed) todo items.

### 2.1 Let's start with the service
Because we need some data to work with let's create a service first. A service is a piece of code that has no visual component and is usually used for handling data. In this case we will be creating a service which will let us get, create, update and delete todo items.

1. First let's create an TodoItem object that will hold all the information for our todo items.
   Create a new file in `src\app` called `TodoItem.ts` and populate it with the following:
   ```typescript
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
   ```
   Now we have a simple object which we can use in our service and, later on, to use it to communicate with our service.

2. Run to following command `ng g service todo`.  
   This command will generate a service for us named 'todo', files are being generated following angular conventions.

3. Now let's create an array that will hold our todo items.
   Import the definition of out TodoItem model at the top of the file.
   ```typescript
   import { TodoItem } from './TodoItem';
   ```
   
   And add an array to store our todo items and a counter for ids.
   ```typescript
   export class TodoService {
       private todoItems: Array<TodoItem>;
       private nextId = 0;
   ```

   Also initialize the array with an todo item already in there.
   ```typescript
   constructor() {
       const ti = new TodoItem();
       ti.title = 'A test todo item';
       ti.description = 'This is a description for my todo item.';
       ti.createdOn = new Date();
       ti.priority = 1;
       ti.id = this.nextId++;

       this.todoItems = [ti];
   }
   ```
4. Now let's add a method to get todo items.
   ```typescript
   /** Get all unarchived todo items */
   getTodoItems(): Promise<TodoItem[]> {
       return Promise.resolve(this.todoItems.filter(item => !item.completedOn));
   }
   ```
   You see I return a `Promise<TodoItem[]>` as return type, the promise is there to make implementing asynchronous actions easier.
   Also you can see I call `.filter(...)` on the todo items, this is to filter out completed items.

5. Add a method to get our archived/completed todo items.
   ```typescript
   /** Get all archived todo items */
  getArchivedTodoItems(): Promise<TodoItem[]> {
      return Promise.resolve(this.todoItems.filter(item => item.completedOn));
  }
   ```

6. Also add a member to get a todo item by id.
   ```typescript
   /** Get a todo item by id */
   getTodoItem(id: number): Promise<TodoItem> {
       return Promise.resolve(this.todoItems.find(item => item.id === id));
   }
   ```

7. Let's also add ways to mutate todo items.
   ```typescript
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
   ```

8. Finally let's add our service as provider so that it can be injected.
   Open the file `app.module.ts` and import the todo-service.
   ```typescript
   import { TodoService } from './todo.service';
   ```
   And add the service as provider in the `providers` array.
   ```typescript
   ...
   providers: [TodoService],
   ...
   ```
   Now the service will be injected if we "ask" for it somewhere in our app.











