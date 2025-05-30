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

  // Load posts from posts.json
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

  // Clear the feed
  feed.innerHTML = '';

  // Render each post
  allPosts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'video-post';

// Replace the postDiv.innerHTML section in loadPosts() function with this:
postDiv.innerHTML = `
  <div class="post-header">
    <strong>📤 ${post.user || 'Unknown User'}</strong>
    <span class="post-time">${post.timestamp ? new Date(post.timestamp).toLocaleDateString() : ''}</span>
  </div>
  <div class="video-wrapper">
    <video src="${post.video}" controls></video>
    <div class="post-description">
      <p>${post.description || ''}</p>
    </div>
    <div class="post-actions">
      <button onclick="likePost(this, ${index})">
        ❤️ Like <span class="like-count">${post.likes || 0}</span>
      </button>
      <button onclick="commentPost(this)">💬 Comment</button>
      <button onclick="sharePost('${post.video}')">📤 Share</button>
    </div>
  </div>
`;

    feed.appendChild(postDiv);
  });
}

loadPosts();

// 4. Like button functionality (1 like per user per post)
function likePost(button, postIndex) {
  const likeKey = `liked_${postIndex}_${currentUser.email}`;
  if (localStorage.getItem(likeKey)) {
    alert('You already liked this post!');
    return;
  }

  const countSpan = button.querySelector('.like-count');
  let count = parseInt(countSpan.textContent) || 0;
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

// 6. Logout function (can be reused across pages)
function logout() {
  localStorage.removeItem('user');
  window.location.href = "login.html";
}
// Add this function at the end of script.js
function sharePost(videoUrl) {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this video on TestoRealm!',
      text: 'Amazing video I found on TestoRealm',
      url: window.location.href
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareText = `Check out this amazing video on TestoRealm: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert('📋 Link copied to clipboard!');
    }).catch(() => {
      alert('📤 Share this link: ' + window.location.href);
    });
  }
}
