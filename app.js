const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");

let tasks = [];

// Load tasks from database and display them
loadTasks();

// Add event listener to the "Add" button in the form
todoForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form from submitting
  const task = {
    id: Date.now(),
    text: todoInput.value,
    completed: false
  };
  tasks.push(task); // Add task to tasks array
  saveTasks(); // Save tasks to database
  displayTasks(); // Update the to-do list display
  todoInput.value = ""; // Clear the input field
});

// Add event listeners to the "Update" and "Delete" buttons
updateButton.addEventListener("click", updateTask);
deleteButton.addEventListener("click", deleteTask);

// Function to display tasks on the page
function displayTasks() {
  todoList.innerHTML = ""; // Clear the current list items
  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = task.text;
    if (task.completed) {
      listItem.classList.add("completed");
    }
    listItem.setAttribute("data-id", task.id);
    todoList.appendChild(listItem);
  });
}

// Function to update a task
function updateTask() {
  const selectedTask = todoList.querySelector(".selected");
  const taskId = selectedTask.getAttribute("data-id");
  const taskIndex = tasks.findIndex((task) => task.id == taskId);
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  saveTasks();
  displayTasks();
}

// Function to delete a task
function deleteTask() {
  const selectedTask = todoList.querySelector(".selected");
  const taskId = selectedTask.getAttribute("data-id");
  tasks = tasks.filter((task) => task.id != taskId);
  saveTasks();
  displayTasks();
}

// Function to load tasks from the database
function loadTasks() {
  // Code to load tasks from the database and populate the tasks array
  // ...
  displayTasks();
}

// Function to save tasks to the database
function saveTasks() {
  // Code to save tasks to the database
  // ...
}
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017/todo-list';
const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
    const db = client.db();
    const tasksCollection = db.collection('tasks');
    return tasksCollection;
  } catch (error) {
    console.log(error);
  }
}

async function addTaskToDatabase(task) {
  const tasksCollection = await connectToDatabase();
  const result = await tasksCollection.insertOne({ task });
  console.log(`Task added to database: ${task}`);
  return result.insertedId;
}

async function updateTaskInDatabase(id, newTask) {
  const tasksCollection = await connectToDatabase();
  const result = await tasksCollection.updateOne({ _id: mongodb.ObjectId(id) }, { $set: { task: newTask } });
  console.log(`Task updated in database: ${newTask}`);
  return result.modifiedCount;
}

async function deleteTaskFromDatabase(id) {
  const tasksCollection = await connectToDatabase();
  const result = await tasksCollection.deleteOne({ _id: mongodb.ObjectId(id) });
  console.log(`Task deleted from database: ${id}`);
  return result.deletedCount;
}

async function getTasksFromDatabase() {
  const tasksCollection = await connectToDatabase();
  const tasks = await tasksCollection.find().toArray();
  console.log(`Retrieved ${tasks.length} tasks from database`);
  return tasks;
}


  const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function addNewTask() {
  const task = taskInput.value.trim();

  if (task !== "") {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task}</span>
      <button class="deleteTask">x</button>
    `;
    taskList.appendChild(li);
    taskInput.value = "";
  }
}

function toggleTaskCompleted(event) {
  const taskItem = event.target.closest("li");
  taskItem.classList.toggle("completed");
}

function deleteTask(event) {
  const taskItem = event.target.closest("li");
  taskList.removeChild(taskItem);
}

addTask.addEventListener("click", addNewTask);
taskList.addEventListener("click", function(event) {
  if (event.target.matches(".deleteTask")) {
    deleteTask(event);
  } else if (event.target.matches(".updateTask")) {
    updateTask(event);
  } else {
    toggleTaskCompleted(event);
  }
});
// Get the update and delete buttons
const updateButtons = document.querySelectorAll(".update-button");

// Add event listeners to the update buttons
updateButtons.forEach((button) => {
  button.addEventListener("click", updateTask);
});

function updateTask(event) {
  const taskItem = event.target.parentElement;
  const taskText = taskItem.querySelector(".task-text");
  
  // Create an input field to allow the user to edit the task
  const taskInput = document.createElement("input");
  taskInput.value = taskText.textContent;
  taskItem.insertBefore(taskInput, taskText);
  taskItem.removeChild(taskText);
  
  // Create a save button to allow the user to save the updated task
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  taskItem.insertBefore(saveButton, taskInput.nextSibling);

  // Add event listener to the save button
  saveButton.addEventListener("click", saveTask);
  
  function saveTask() {
    const updatedText = taskInput.value;
    
    // Update the task in the to-do list
    taskItem.insertBefore(taskText, taskInput);
    taskItem.removeChild(taskInput);
    taskText.textContent = updatedText;
    
    // Remove the save button
    taskItem.removeChild(saveButton);
  }
}

