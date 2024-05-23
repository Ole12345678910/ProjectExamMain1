// Import other necessary functions and variables
import { toggleLoginLogout, checkLoginStatus, API_BASE_URL } from './utility.js';

// Define loginUser function in the global scope
window.loginUser = async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch(`${API_BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (response.ok) {
      const json = await response.json();

      // Store the access token and name in localStorage
      localStorage.setItem("accessToken", json.data.accessToken);
      localStorage.setItem("name", json.data.name);
      // Redirect to dashboard or another page upon successful login
      window.location.href = "/index.html";
    } else {
      // If response status is not OK, throw an error
      throw new Error("Login failed");
    }
  } catch (error) {
    // Handle any errors that occurred during login
    console.error("Login error:", error.message);
    document.getElementById("error-message").textContent =
    "Login failed. Please try again.";
  }
}

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// Use toggleLoginLogout function when a logout button is clicked
const logoutButton = document.getElementById("login-logout-btn");
logoutButton.addEventListener("click", toggleLoginLogout);
