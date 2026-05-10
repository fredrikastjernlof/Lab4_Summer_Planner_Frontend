// dashboard.js - Handles dashboard page access and user session management

// Import the initEvents function from the events.js module
import { initEvents } from "./events.js";

// Function to initialize the dashboard page
export function initDashboard() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const logoutButton = document.querySelector("#logoutButton");

  logoutButton?.addEventListener("click", logoutUser);

  initEvents();
}

// Function to handle user logout
function logoutUser() {
  sessionStorage.removeItem("token");
  window.location.href = "/";
}