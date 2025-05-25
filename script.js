// 1. Check if the user is logged in
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

// 2. Display welcome message if user exists
if (currentUser) {
  const welcomeEl = document.getElementById('welcome-user');
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome, ${currentUser.name || currentUser.email}`;
  }
}

// 3. Load and display posts from BOTH localStorage AND posts.json
async function loadPosts() {
  const feed = document.getElementById('video-feed');
  let allPosts = [];

  try {
    const response = await fetch('posts.json');
    if (!response.ok) throw new Error("HTTP status " + response.status);
    const jsonPosts = await response.json();
    allPosts = allPosts.concat(jsonPosts);
  } catch (error) {
    console.error('❌ Error loading posts.json:', error);
  }

  // Load posts from localStorage
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  allPosts = localPosts.concat(allPosts); // local posts first (newest)

  // Display all posts
  feed.innerHTML = ''; // Clear feed
  allPosts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'video-post';

    postDiv.innerHTML = `
      <div class="post-header">
        <strong>📤 ${post.user || 'Unknown User'}</strong>
      </div>
      <div class="video-wrapper">
        <video src="${post.video}" controls></video>
        <div class="post-actions">
          <button onclick="likePost(this, ${index})">❤️ Like <span class="like-count">${post.likes}</span></button>
          <button onclick="commentPost(this)">💬 Comment</button>
        </div>
      </div>
    `;

    feed.appendChild(postDiv);
  });
}

loadPosts();

// 4. Like button functionality (limit to 1 like per user per post)
function likePost(button, postIndex) {
  const likeKey = `liked_${postIndex}_${currentUser.email}`;
  if (localStorage.getItem(likeKey)) {
    alert('You already liked this post!');
    return;
  }

  const countSpan = button.querySelector('.like-count');
  let count = parseInt(countSpan.textContent);
  count++;
  countSpan.textContent = count;

  localStorage.setItem(likeKey, true);
}

// 5. Comment button functionality
function commentPost(button) {
  const post = button.closest('.video-post');
  let commentSection = post.querySelector('.comment-section');

  if (!commentSection) {
    commentSection = document.createElement('div');
    commentSection.className = 'comment-section';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a comment...';

    const sendBtn = document.createElement('button');
    sendBtn.textContent = 'Send';

    sendBtn.onclick = function () {
      const commentText = input.value.trim();
      if (commentText !== '') {
        const comment = document.createElement('p');
        comment.textContent = `${currentUser.name || currentUser.email}: ${commentText}`;
        commentSection.appendChild(comment);
        input.value = '';
      }
    };

    commentSection.appendChild(input);
    commentSection.appendChild(sendBtn);
    post.appendChild(commentSection);
  }
}

// 6. Logout function
function logout() {
  localStorage.removeItem('user');
  window.location.href = "login.html";
}

// 7. Open profile
function openProfile() {
  if (currentUser) {
    alert(`👤 Profile:\nName: ${currentUser.name}\nEmail: ${currentUser.email}`);
  } else {
    alert("❌ No user is logged in.");
  }
}
