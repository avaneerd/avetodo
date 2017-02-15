# avetodo
This project is for educational purposes with which I want to teach you the basics of Angular(2). It will also include a node server to persist data and to also get you familiar with communication from Angular with web services.

Following this training should teach you the following:
- Building an app with Angular 2 and Bootstrap 4.
- Building a node server with Express and NeDB.

This training assumes you have nodejs and git installed.

## 1. setting up the project

1. Install the Angular CLI tooling by running `npm install @angular/cli -g` from the command line.  
   The `-g` option install the tooling as global, this means that from every command window you option that tooling will be available.  
   After installing the Angular CLI tooling you have the `ng` command available.
   
2. Goto to a folder where you store your sources and run the command `ng new avetodo`.  
   This will create a new folder named 'avetodo' in which `ng init` will be run.  
   'ng init ' will create a angular boilerplate project and pull in the dependencies for it.
   
3. Go into the folder the folder was created and run `npm install jquery tether bootstrap@next --save`.  
   This will install bootstrap, tether and jquery as dependency for our project. The `--save` option` saves bootstrap as an dependency to `package.json`.
   
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

1. First let's create an TodoItem model that will hold all the information for our todo items.
   
   Run the following command to create a new class file `ng g class TodoItem`.

   Now open the generated file it's called `todo-item.ts` and you can find it in `src/app`.
   Populate it with the following:
   ```typescript
    export class TodoItem {
        /** The id of the todo item */
        _id: number;

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
    import { TodoItem } from './todo-item';
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
        ti._id = this.nextId++;

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
        return Promise.resolve(this.todoItems.find(item => item._id === id));
    }
   ```

7. Let's also add ways to mutate todo items.
   ```typescript
    /** Add a todo item */  
    addTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        todoItem._id = this.nextId++;
        this.todoItems.push(todoItem);

        return Promise.resolve(todoItem);
    }

    /** edit a todo item */
    editTodoItem(id: number, todoItem: TodoItem): Promise<TodoItem> {
        const existingItem = this.todoItems.find(item => item._id === id);

        if (existingItem) {
            this.todoItems.splice(this.todoItems.indexOf(existingItem), 1);
        }

        todoItem._id = id;
        this.todoItems.push(todoItem);

        return Promise.resolve(todoItem);
    }

    /** delete a todo item */
    deleteTodoItem(id: number): Promise<void> {
        const existingItem = this.todoItems.find(item => item._id === id);

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
    providers: [TodoService],
   ```
   Now the service will be injected if we "ask" for it somewhere in our app.

### 2.2 Creating the todo item component 
Because we will be rendering todo items on multiple places we want them to be separate components, so that we can reuse the component on separate pages.

1. Run the command `ng g component todoItem` to generate a component.

2. This component will be receiving a TodoItem-object, this should be received and be exposed to the template by the component.
   Open the `todo-item.component.ts` class that is generated.

   Because we will be working with the TodoItem model we created earlier we have to import again in this component.
   ```typescript
    import { TodoItem } from './../todo-item';
   ```

   Also because we will be working with an input parameter we want to import the needed `Input` for it aswell.
   ```typescript
    import { Component, Input, OnInit } from '@angular/core';
   ```

   Now let's create a property that will act as input parameter.
   ```typescript
    export class TodoItemComponent implements OnInit {
        @Input() todoItem: TodoItem;
   ```
   This input parameter we will be using later in our code.

3. Now let's switch to the template `todo-item.template.html` and put in some basic output.
   ```html
    <div>
        <h1>{{ todoItem.title }}</h1>
        <p>{{ todoItem.description }}</p>
        <p>prio: {{ todoItem.priority }}</p>
        <p>created on: {{ todoItem.createdOn }}</p>
        <p *ngIf="todoItem.completedOn">completed on: {{ todoItem.completedOn }}</p>
        <button (click)="completeItem()" *ngIf="!todoItem.completedOn">Completed</button>
    </div>
   ```
   As you can see I also added a button with a click event and an if statement. 
   If the `completedOn` on the todo item is not null the button will not be rendered.
   
   Note that this is a very basic (read ugly) view of our todo item, we will be pimping it later ;-)

4. In the previous step we added a button in the view, it has a click event which has not been implemented yet.
   Open `todo-item.component.ts` and add the `completeItem` method that is being called in the view.
   ```typescript
   completeItem() {
   }
   ```

5. Because we will be using the `TodoService` let's import it.
   ```typescript
    import { TodoService } from './../todo.service';
   ```

6. Now we can "ask" for the `TodoService` in the constructor of the component, as it's been registered as provider in `app.module.ts` it will be automatically be injected.
   ```typescript
    constructor(private todoService: TodoService) { }
   ```
   Adding private before a constructor parameter automatically creates the parameter as a private field on the class.

7. Now let's implement the `completeItem` method.
   ```typescript
    completeItem() {
        this.todoItem.completedOn = new Date();

        this.todoService.editTodoItem(this.todoItem._id, this.todoItem)
            .then(null,
            () => {
            alert('Failed saving changes');
            this.todoItem.completedOn = null;
        });
    }
   ```
   Here you see that in the promise (the `then(..., ...)`) I specify `null` as first parameter. 
   This is because I don't want anything to happen when the request is completed successfully. 
   Because this method was called through angular it knows it should check if the bindings to the views are still up to date.
   In this case after setting the `completedOn` date to the current date the 'complete' button should disappear from the view because the ngIf expression evaluates to false.
   
   When the request fails on the other hand I want it the show an error and reset the `completedOn` value.

### 2.3 Todo item list component
Now we have a todo item component but it is just one component, we now need some sort of container that renders multiple of these todo item components.
This component will be very straight forward, it will receive todo items and will render todo item components for each of them.

1. Run the command `ng g component todoItemList` to generate a component.

2. Just like the todo item component this component will have a parameter, in this case to receive an array of todo items to render.
   Open the `todo-item-list.component.ts` class that is generated.

   import the Input and TodoItem classes.
   ```typescript
    import { TodoItem } from './../todo-item';
    import { Component, Input, OnInit } from '@angular/core';
   ```

   And add the input property.
   ```typescript
    export class TodoItemListComponent implements OnInit {
        @Input() todoItems: Array<TodoItem>;
   ```

3. Now let's add the view for it in `todo-item-list.template.html`.
   ```html
    <div>
        <app-todo-item *ngFor="let item of todoItems" [todoItem]="item"></app-todo-item>
    </div>
   ```

### 2.4 Creating the todo overview page
Now that we have components to render our todo items we now need a component that gets that data and uses the todo item list component to render the todo items.
This component will also serve as the landing page for our app.

1. Run the command `ng g component overview` to generate a component.

2. To render todo items on the screen we first need to expose them in our component.
   Open the `overview.component.ts` class that is generated.

   Import the `TodoItem` model and the `TodoService`.
   ```typescript
    import { TodoItem } from './../todo-item';
    import { TodoService } from './../todo.service';
   ```

   Now add a property of the type `Array<TodoItem>`.
   ```typescript
    export class OverviewComponent implements OnInit {
        todoItems: Array<TodoItem>;
   ```

   Now let's inject the `TodoService` again.
   ```typescript
    constructor(private todoService: TodoService) { }
   ```

   When we want to load data when the component is initialized we should use the ngOnInit method for this. 
   Angular cli already generated an empty `ngOnInit` method for us, so let's implement it to fetch todo items from the todo service.
   ```typescript
    ngOnInit() {
        this.todoService.getTodoItems()
            .then(items => this.todoItems = items, () => alert('Error loading todo items.'));
    }
   ```

3. Switch to the `overview.template.html` template to implement our view.
   This will be a simple component that will just use the todo item list component to render todo items.
   ```html
   <app-todo-item-list [todoItems]="todoItems"></app-todo-item-list>
   ```

4. And finally to show our overview we have to add the component to the default app component. 
   The app component is the component that is bootstrapped by angular (as configured in the `app.module.ts`).
   So if we want to show our component we have to add it to the app component.

   Open `app.component.html` and replace the content with the following:
   ```html
    <app-overview></app-overview>
   ```

### 2.5 The result
Now let's build and run our project to see the ugly fruits of our effort :-)
Do this by running `ng serve` and going to `http://localhost:4200` in your browser.

The result should be something like this:  
![ave todo first run](/readmecontent/images//first-run-todo.png?raw=true)

We can click the 'complete' button to see it disappear and see a completed date show up instead. 

Because we don't save the data persistently the changes we make will be gone after refreshing.
In the next chapter we will be creating a server in node to be able to save the data to disc.


## 3. Building the node server

Now we are going to build a server that will be hosted in nodejs. 
We will implement a RESTfull web service using Express and save the data to a local database using NeDB.

### 3.1 Setting up for creating the server

1. Let's start with pulling in the dependencies we need to implement our server.
   Run `npm install express nedb --save` to download and save both Express and NeDB as dependency.

2. Now in the root of our project let's create a folder called `server` in this folder we will put the code for our server.

### 3.2 Creating the TodoItem model
Because we will be using CommonJS and not TypeScript for our server code we need to recreate the model for the `TodoItem`.
Create a new file called `todo-item.js` in the 'server' folder.
Fill the file with the following:
```javascript
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
```

### 3.3 Setting up the server
1. Create a new file called `server.js` in the folder 'server'.

2. In CommonJS you can also import dependencies much like we already did in TypeScript only the syntax is a bit different.
   Let's start with importing the `TodoItem` model and express.
   ```javascript
    var TodoItem = require('./todo-item');
    var express = require('express');
   ```

3. Next let's bootstrap Express so that we can start hosting our own RESTfull web service.
   ```javascript
    var app = express();

    app.listen(3000, function () {
        console.log('avetodo server running on http://localhost:3000');
    });
   ```

4. Now let's implement a simple get method. Make sure you place all the code for express before the `app.listen(...)` line.
   ```javascript
    app.get('/', function (req, res) {
        res.send('Hello World!')
    });
   ```

5. Now run the server using `node .\server\server.js` and goto `http://localhost:3000` in your browser.
   The result should be 'Hello World!'.

### 3.4 Creating a data store for todo items.

1. Create a new file called `todo-item-store.js` in the folder 'server'.

2. Import NeDB and our `TodoItem` model.
   ```javascript
    var TodoItem = require('./todo-item');
    var Datastore = require('nedb');
   ```

3. Now let's make a `TodoItemStore` class and initialize a local database using a NeDB-datastore.
   ```javascript
    function TodoItemStore() {
        var db = new Datastore({ filename: 'todo-items.db', autoload: true });
    }

    module.exports = TodoItemStore;
   ```

4. Now let's implement a method to get unarchived todo items sorted by `priority` from the datastore.  
   Add this code after the `function TodoItemStore() { ... }` body and before `module.exports = TodoItemStore`.
   ```javascript
    TodoItemStore.prototype.getOpenTodoItem = function () {
        return new Promise(function(resolve, reject) {
            // Get items where createdOn is null and sort by priority descending.
            db.find({ createdOn: null }).sort({ priority: -1 }).exec(function (err, docs) {
                if (err) {
                    reject(err);
                }

                resolve(docs);
            });
        });
    };
   ```
   Because the the datastore is asynchronous but does not implement promises we implemented our own promise and return that as result of the function.  
   When the datastore returns with result either `resolve(...)` or `reject(...)` is called depending if an error occurred or not.  

   Promises expose a function `.then(..., ...)` which expects 2 functions. 
   The first one is code to run when the asynchronous action resolved successfully and the second one (which is optional) is called when the asynchronous action failed and is rejected.

### 3.5 Exposing the get function in our web service
1. Let's open `server.js` again and make use of our datastore.
   ```javascript
    var TodoItemStore = require('./todo-item-store');
   ```

2. Make an instance of our datastore. Put this line before `var app = express();`.
   ```javascript
   var todoItemStore = new TodoItemStore();
   ```
3. Now let's change the implementation of out `app.get(...)` to retrieve and return data from our datastore.  
   ```javascript
    app.get('/', function (req, res) {
        todoItemStore.getOpenTodoItem()
            .then((todoItems) => res.send(todoItems), (err) => res.status(500).send(err));
    });
   ```
   Now when our asynchronous action is finished a `res.rend(...)` is called to send response back to the client.  
   If the asynchronous action failed the status is set to 500 and the error is send back.