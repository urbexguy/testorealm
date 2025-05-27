// login.js

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const user = {
    name: email.split("@")[0],
    email: email
  };

  localStorage.setItem('user', JSON.stringify(user));
  alert("Login successful!");

  window.location.href = "index.html";
}
