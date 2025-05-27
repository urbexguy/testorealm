document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const posts = JSON.parse(localStorage.getItem("user_posts")) || [];
  
    if (!user) {
      alert("You must be logged in to view this page.");
      window.location.href = "login.html";
      return;
    }
  
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  
    const userPostsContainer = document.getElementById("user-posts");
  
    if (posts.length === 0) {
      userPostsContainer.innerHTML = "<p>You haven't uploaded any videos yet.</p>";
      return;
    }
  
    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("user-post");
  
      postDiv.innerHTML = `
        <p><strong>Description:</strong> ${post.description || "No description"}</p>
        <video src="${post.video}" controls width="300"></video>
        <p><strong>Likes:</strong> ${post.likes}</p>
      `;
  
      userPostsContainer.appendChild(postDiv);
    });
  });
  
