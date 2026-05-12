// dashboard.js - Handles dashboard page access and user session management

// Import the initEvents and initTodos functions from their respective modules
import { initEvents } from "./events.js";
import { initTodos } from "./todos.js";
import { API_URL, getAuthHeaders } from "./api.js";



// Function to initialize the dashboard page
export function initDashboard() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const logoutButton = document.querySelector("#logoutButton");
  const deleteAccountButton = document.querySelector("#deleteAccountButton");

  logoutButton?.addEventListener("click", logoutUser);
  deleteAccountButton?.addEventListener("click", deleteAccount);

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

async function deleteAccount() {
  const confirmed = confirm(
    "Are you sure? This will permanently delete your account, events and todos."
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/auth/delete-account`,
      {
        method: "DELETE",
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      alert("Could not delete account.");
      return;
    }

    sessionStorage.removeItem("token");

    window.location.href = "/";
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}