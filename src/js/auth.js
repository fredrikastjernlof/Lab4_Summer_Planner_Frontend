// auth.js - Handles user registration and login

// Import the API URL from the api.js module
import { API_URL } from "./api.js";

// Function to initialize authentication event listeners
export function initAuth() {
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const cancelLoadingButton = document.querySelector("#cancelLoadingButton");

    registerForm?.addEventListener("submit", handleRegister);
    loginForm?.addEventListener("submit", handleLogin);
    cancelLoadingButton?.addEventListener("click", hideLoadingOverlay);
}

// Function to handle user registration
async function handleRegister(event) {
    event.preventDefault();

    const username = document.querySelector("#registerUsername").value;
    const password = document.querySelector("#registerPassword").value;
    const passwordConfirm = document.querySelector("#registerPasswordConfirm").value;

    if (!username || !password || !passwordConfirm) {
        showRegisterStatus("Please fill in all fields.");
        return;
    }

    if (password !== passwordConfirm) {
        showRegisterStatus("Passwords do not match.");
        return;
    }

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
        showRegisterStatus(data.message || "Could not create account");
        return;
    }

    showRegisterStatus(
        "Account created! You can now log in ✅",
        "success"
    );
}

// Function to handle user login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.querySelector("#loginUsername").value;
    const password = document.querySelector("#loginPassword").value;

    showLoadingOverlay("Signing in...");

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
        hideLoadingOverlay();
        showLoginStatus(data.message || "Could not log in");
        return;
    }
    // Store the token in session storage and redirect to the dashboard
    sessionStorage.setItem("token", data.token);
    window.location.href = "/dashboard.html";
}

// Function to display registration status messages
function showRegisterStatus(message, type = "error") {
    const statusMessage = document.querySelector("#registerStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.className = `status-message status-message--${type}`;
}

// Function to show the loading overlay with a custom message
function showLoadingOverlay(message) {
    const overlay = document.querySelector("#loadingOverlay");
    const loadingMessage = document.querySelector("#loadingMessage");

    if (!overlay || !loadingMessage) {
        return;
    }

    loadingMessage.textContent = message;

    overlay.classList.remove("hidden");
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
    const overlay = document.querySelector("#loadingOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.add("hidden");
}

// Function to display login status messages
function showLoginStatus(message, type = "error") {
    const statusMessage = document.querySelector("#loginStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.className = `status-message status-message--${type}`;
}