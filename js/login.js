const API_BASE_URL = "https://v2.api.noroff.dev/";

async function loginUser() {
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


// Function to toggle between login and logout
function toggleLoginLogout() {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // If logged in, perform logout actions
    localStorage.clear(); // Clear local storage
    window.location.href = "/index.html"; // Redirect to index page
  } else {
    // If not logged in, redirect to the login page
    window.location.href = "/account/login.html";
  }
}

// Function to check if the user is logged in
function checkLoginStatus() {
  const accessToken = localStorage.getItem("accessToken");
  const loginButton = document.getElementById("login-logout-btn");

  if (accessToken) {
    // If logged in, change button text to "Logout" and add event listener
    loginButton.textContent = "Logout";
    loginButton.addEventListener("click", toggleLoginLogout);
  } else {
    // If not logged in, keep button text as "Login" and add event listener
    loginButton.textContent = "Login";
    loginButton.addEventListener("click", () => {
      window.location.href = "/account/login.html";
    });
  }
}

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);
