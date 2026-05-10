export const API_URL = "https://lab4-summerplansapi.onrender.com/api";

export function getToken() {
  return sessionStorage.getItem("token");
}

export function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}