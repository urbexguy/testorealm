// login.js

function login() {
  // Get the input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Simple validation
  if (email === "" || password === "") {
    alert("Please enter both email and password.");
    return;
  }

  // Simulate login success
  const user = {
    name: email.split("@")[0], // Extract name from email
    email: email
  };

  // Store user information in localStorage
  localStorage.setItem('user', JSON.stringify(user));

  alert("Login successful!");

  // Redirect to the main app page
  window.location.href = "index.html";
}
