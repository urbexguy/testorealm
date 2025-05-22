// login.js

// This function runs when the "Login" button is clicked
function login() {
    // Get the input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Simple validation (you can improve this later)
    if (email === "" || password === "") {
      alert("Please enter both email and password.");
      return;
    }
  
    // Simulate login success
    // Later, you'll connect this to Google login or a real database
    alert("Login successful!");
  
    // Redirect to the main app page (index.html)
    window.location.href = "index.html";
  }
  