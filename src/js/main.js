import "../scss/style.scss";
import { initAuth } from "./auth.js";
import { initDashboard } from "./dashboard.js";

const registerForm = document.querySelector("#registerForm");
const dashboard = document.querySelector(".dashboard-layout");

if (registerForm) {
  initAuth();
}

if (dashboard) {
  initDashboard();
}