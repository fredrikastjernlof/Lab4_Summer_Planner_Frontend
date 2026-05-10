export function initDashboard() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  console.log("Dashboard loaded");
}