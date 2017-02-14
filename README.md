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