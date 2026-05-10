// auth.js - Handles user registration and login

// Import the API URL from the api.js module
import { API_URL } from "./api.js";

// Function to initialize authentication event listeners
export function initAuth() {
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");

    registerForm?.addEventListener("submit", handleRegister);
    loginForm?.addEventListener("submit", handleLogin);
}

// Function to handle user registration
async function handleRegister(event) {
    event.preventDefault();

    const username = document.querySelector("#registerUsername").value;
    const password = document.querySelector("#registerPassword").value;

    // Send a POST request to the registration endpoint
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Could not create account");
        return;
    }

    alert("Account created! You can now log in.");
}

// Function to handle user login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.querySelector("#loginUsername").value;
    const password = document.querySelector("#loginPassword").value;

    // Send a POST request to the login endpoint
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Could not log in");
        return;
    }

    // Store the token in session storage and redirect to the dashboard
    sessionStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
}