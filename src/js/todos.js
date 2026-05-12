// todos.js - Handles todo CRUD functionality

import { API_URL, getAuthHeaders } from "./api.js";

// Initialize todo functionality
export function initTodos() {
    const todoForm = document.querySelector("#todoForm");

    todoForm?.addEventListener("submit", createTodo);

    getTodos();
}

// Create a new todo
async function createTodo(event) {
    event.preventDefault();

    const todoInput = document.querySelector("#todoText");

    todoInput.addEventListener("input", () => {
        todoInput.classList.remove("input-error");
        showTodoStatus("");
    });

    todoInput.classList.remove("input-error");

    const todoText = todoInput.value.trim();

    if (todoText.length < 1) {
        todoInput.classList.add("input-error");
        showTodoStatus("Please write something before adding a todo.");
        return;
    }

    const newTodo = {
        text: todoText,
        completed: false
    };

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(newTodo)
        });

        if (!response.ok) {
            alert("Could not create todo");
            return;
        }

        event.target.reset();

        showTodoStatus("");

        getTodos();
    } catch (error) {
        console.error("Error creating todo:", error);
    }
}

// Fetch all todos
async function getTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            alert("Could not fetch todos");
            return;
        }

        const todos = await response.json();

        renderTodos(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// Render todos in the todo panel
function renderTodos(todos) {
    const todosList = document.querySelector("#todosList");

    todosList.innerHTML = "";

    if (todos.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No todos yet";

        todosList.append(emptyMessage);

        return;
    }

    // Sort unfinished todos first, completed todos last
    const sortedTodos = [...todos].sort((a, b) => {
        return a.completed - b.completed;
    });

    sortedTodos.forEach((todoItem) => {
        const todoCard = document.createElement("article");
        todoCard.classList.add("todo-item");

        if (todoItem.completed) {
            todoCard.classList.add("todo-item--completed");
        }

        const checkButton = document.createElement("button");
        checkButton.classList.add("todo-check");
        checkButton.type = "button";
        checkButton.textContent = todoItem.completed ? "✓" : "";

        checkButton.addEventListener("click", () => {
            toggleTodo(todoItem);
        });

        const text = document.createElement("p");
        text.textContent = todoItem.text;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("todo-delete");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTodo(todoItem._id);
        });

        todoCard.append(checkButton, text, deleteButton);
        todosList.append(todoCard);
    });
}

// Toggle completed status
async function toggleTodo(todoItem) {
    try {
        const response = await fetch(`${API_URL}/todos/${todoItem._id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                completed: !todoItem.completed
            })
        });

        if (!response.ok) {
            alert("Could not update todo");
            return;
        }

        getTodos();
    } catch (error) {
        console.error("Error updating todo:", error);
    }
}

// Delete a todo
async function deleteTodo(todoId) {
    try {
        const response = await fetch(`${API_URL}/todos/${todoId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            alert("Could not delete todo");
            return;
        }

        getTodos();
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

// Show a status message in the todo panel
function showTodoStatus(message) {
    const statusMessage = document.querySelector("#todoStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
}
