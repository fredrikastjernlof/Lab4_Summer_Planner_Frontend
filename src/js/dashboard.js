// dashboard.js - Handles dashboard functionality and user session management

// Function to initialize the dashboard
export function initDashboard() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "/";
        return;
    }

    const logoutButton = document.querySelector("#logoutButton");

    logoutButton?.addEventListener("click", logoutUser);
}

// Function to log out the user
function logoutUser() {
    sessionStorage.removeItem("token");
    window.location.href = "/";
}