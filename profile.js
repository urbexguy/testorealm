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
      <p><strong>Name:</strong> ${user.name || user.email}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Total Videos:</strong> ${posts.length}</p>
    `;
  
    const userPostsContainer = document.getElementById("user-posts");
  
    if (posts.length === 0) {
      userPostsContainer.innerHTML = "<p>You haven't uploaded any videos yet.</p>";
      return;
    }
  
    posts.forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("user-post");
      postDiv.setAttribute("data-post-id", post.id);
  
      postDiv.innerHTML = `
        <p><strong>Description:</strong> ${post.description || "No description"}</p>
        <video src="${post.video}" controls width="300"></video>
        <p><strong>Likes:</strong> ${post.likes || 0}</p>
        <div class="post-actions">
          <button onclick="deletePost(${post.id}, this)" style="background: #dc3545; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">
            🗑️ Delete
          </button>
          <button onclick="editDescription(${post.id}, this)" style="background: #007bff; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">
            ✏️ Edit
          </button>
        </div>
      `;
  
      userPostsContainer.appendChild(postDiv);
    });
});

// Delete post function
function deletePost(postId, button) {
  if (!confirm("Are you sure you want to delete this video?")) {
    return;
  }

  // Remove from user_posts
  let userPosts = JSON.parse(localStorage.getItem("user_posts")) || [];
  userPosts = userPosts.filter(post => post.id !== postId);
  localStorage.setItem("user_posts", JSON.stringify(userPosts));

  // Remove from general posts
  let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  allPosts = allPosts.filter(post => post.id !== postId);
  localStorage.setItem("posts", JSON.stringify(allPosts));

  // Remove from DOM
  const postDiv = button.closest('.user-post');
  postDiv.remove();

  alert("✅ Video deleted successfully!");
  
  // Refresh page to update counts
  location.reload();
}

// Edit description function
function editDescription(postId, button) {
  const postDiv = button.closest('.user-post');
  const descriptionP = postDiv.querySelector('p');
  const currentDescription = descriptionP.textContent.replace('Description: ', '');
  
  const newDescription = prompt("Edit description:", currentDescription);
  
  if (newDescription !== null && newDescription.trim() !== '') {
    // Update user_posts
    let userPosts = JSON.parse(localStorage.getItem("user_posts")) || [];
    const userPostIndex = userPosts.findIndex(post => post.id === postId);
    if (userPostIndex !== -1) {
      userPosts[userPostIndex].description = newDescription.trim();
      localStorage.setItem("user_posts", JSON.stringify(userPosts));
    }

    // Update general posts
    let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const allPostIndex = allPosts.findIndex(post => post.id === postId);
    if (allPostIndex !== -1) {
      allPosts[allPostIndex].description = newDescription.trim();
      localStorage.setItem("posts", JSON.stringify(allPosts));
    }

    // Update DOM
    descriptionP.innerHTML = `<strong>Description:</strong> ${newDescription.trim()}`;
    alert("✅ Description updated successfully!");
  }
}
// Add this function at the end of profile.js
function calculateStats() {
  const posts = JSON.parse(localStorage.getItem("user_posts")) || [];
  const totalVideos = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const averageLikes = totalVideos > 0 ? Math.round(totalLikes / totalVideos) : 0;
  
  // Find most liked video
  const mostLikedVideo = posts.reduce((max, post) => 
    (post.likes || 0) > (max.likes || 0) ? post : max, { likes: 0 });

  const statsContainer = document.getElementById("user-stats");
  statsContainer.innerHTML = `
    <div class="stat-box" style="text-align: center; margin: 10px; padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="color: #007bff; margin: 0;">📹 Total Videos</h4>
      <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #333;">${totalVideos}</p>
    </div>
    <div class="stat-box" style="text-align: center; margin: 10px; padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="color: #dc3545; margin: 0;">❤️ Total Likes</h4>
      <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #333;">${totalLikes}</p>
    </div>
    <div class="stat-box" style="text-align: center; margin: 10px; padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="color: #28a745; margin: 0;">📈 Avg Likes</h4>
      <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #333;">${averageLikes}</p>
    </div>
    <div class="stat-box" style="text-align: center; margin: 10px; padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="color: #ffc107; margin: 0;">🏆 Best Video</h4>
      <p style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #333;">${mostLikedVideo.likes || 0} likes</p>
    </div>
  `;
}

// Call this function in the DOMContentLoaded event (add this line after the posts.forEach loop)
// Add this line after the posts.forEach loop in the DOMContentLoaded function:
calculateStats();
