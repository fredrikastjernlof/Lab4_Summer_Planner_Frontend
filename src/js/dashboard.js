// dashboard.js - Handles dashboard page access and user session management

// Import the initEvents and initTodos functions from their respective modules
import { initEvents } from "./events.js";
import { initTodos } from "./todos.js";

// Function to initialize the dashboard page
export function initDashboard() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const logoutButton = document.querySelector("#logoutButton");

  logoutButton?.addEventListener("click", logoutUser);

  showWelcomeMessage();

  initEvents();
  initTodos();
}

// Displays a personal welcome message using the username from the JWT token
function showWelcomeMessage() {
  const welcomeMessage = document.querySelector("#welcomeMessage");

  const token = sessionStorage.getItem("token");

  if (!token || !welcomeMessage) {
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));

  welcomeMessage.textContent =
    `Welcome to yet another wonderful summer week, ${payload.username}! 🍓`;
}

// Function to handle user logout
function logoutUser() {
  sessionStorage.removeItem("token");
  window.location.href = "/";
}