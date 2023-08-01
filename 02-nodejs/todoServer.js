/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
let todos = [{
  title: 'New Todo',
  description: 'A new todo item',
  id: "ABC"
}];

const generateRandomId = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const findTodo = (id) => {
  return todos.find(todo => todo.id == id);
}

app.get('/todos', (req, res) => {
  const response = {todos};
  return res.status(200).json(response);
});

app.get('/todos/:id', (req, res) => {
  const {id} = req.params;
  const toDo = findTodo(id);
  if(toDo == undefined) {
    return res.status(404).send("Not Found");
  }
  const response = {toDo};
  return res.status(200).json(response);
});

app.post('/todos', (req, res) => {
  const item = req.body;
  const id = generateRandomId(7);
  const todo = {...item, id};
  todos.push(todo);
  if(todos.find(to => to == todo) == undefined || todos.length == 0) {
    return res.status(500).send("Internal Server Error :(");
  }
  return res.status(200).json(todo);
});

app.put('/todos/:id', (req, res) => {
  const {id} = req.params;
  const {title, completed, description} = req.body;
  if(todos.length == 0) {
    return res.status(500).send("Todos is empty :(");
  }
  let todo = todos.find(todo => todo.id == id);
  if(todo == undefined) {
    return res.status(404).send("Not Found");
  }
  
  for(let i of todos) {
    if(i.id == id) {
      if(title != undefined || title != '') {
        i.title = title;
      }
      if(completed != undefined || completed != '') {
        i.completed = completed;
      }
      if(description != undefined || description != '') {
        i.description = description;
      }
      return res.status(200).send("OK");
    }
  }
});

app.delete('/todos/:id', (req, res) => {
  const {id} = req.params;
  if(todos.length == 0) {
    return res.status(500).send("Todos is empty :(");
  }
  let rmTodo = findTodo(id);
  if(rmTodo == undefined) {
    return res.status(404).send("Not Found");
  }
  todos = todos.filter(todo => todo != rmTodo);
  return res.status(200).send("OK");
});

app.get("/:any", (req, res) => {
  return res.status(404).send("Invalid Route :)");
});

app.listen(4000, () => console.log("running"));

module.exports = app;
