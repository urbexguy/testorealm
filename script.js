// 1. Check if the user is logged in
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

let allPosts = [];
let currentPostIndex = 0;
let isLoading = false;

// 2. Load and display posts
async function loadPosts() {
  if (isLoading) return;
  isLoading = true;

  const feed = document.getElementById('video-feed');
  const loading = document.getElementById('loading');
  
  try {
    // Load posts from posts.json
    try {
      const response = await fetch('posts.json');
      if (response.ok) {
        const jsonPosts = await response.json();
        allPosts = allPosts.concat(jsonPosts);
      }
    } catch (error) {
      console.error('❌ Error loading posts.json:', error);
    }

    // Load posts from localStorage
    const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
    allPosts = localPosts.concat(allPosts);

    // Remove loading indicator
    if (loading) loading.style.display = 'none';

    // Clear the feed
    feed.innerHTML = '';

    // Render posts
    renderPosts();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
  
  isLoading = false;
}

function renderPosts() {
  const feed = document.getElementById('video-feed');
  
  allPosts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'video-post';
    postDiv.setAttribute('data-index', index);

    postDiv.innerHTML = `
      <video 
        src="${post.video}" 
        muted
        loop
        playsinline
        preload="metadata"
        onloadeddata="handleVideoLoad(this)"
      ></video>
      
      <div class="post-overlay">
        <div class="post-header">
          <strong>@${post.user || 'Unknown User'}</strong>
          <span class="post-time">${post.timestamp ? formatTime(post.timestamp) : ''}</span>
        </div>
        <div class="post-description">
          <p>${post.description || ''}</p>
        </div>
      </div>

      <div class="side-actions">
        <button class="action-btn like-btn" onclick="likePost(${index}, this)">
          ❤️
          <span class="like-count">${post.likes || 0}</span>
        </button>
        <button class="action-btn" onclick="openComments(${index})">
          💬
          <span class="comment-count">${(post.comments || []).length}</span>
        </button>
        <button class="action-btn" onclick="sharePost('${post.video}')">
          📤
        </button>
      </div>
    `;

    feed.appendChild(postDiv);
  });

  // Initialize video intersection observer
  setupVideoObserver();
}

// 3. Video auto-play functionality
function setupVideoObserver() {
  const videos = document.querySelectorAll('.video-post video');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Play video when in view
        video.play().catch(e => console.log('Autoplay prevented'));
        video.currentTime = 0;
      } else {
        // Pause video when out of view
        video.pause();
      }
    });
  }, {
    threshold: 0.5 // Video must be 50% visible
  });

  videos.forEach(video => observer.observe(video));
}

// 4. Handle video loading
function handleVideoLoad(video) {
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

// 5. Like functionality
function likePost(postIndex, button) {
  const likeKey = `liked_${postIndex}_${currentUser.email}`;
  const likeCountSpan = button.querySelector('.like-count');
  
  if (localStorage.getItem(likeKey)) {
    // Unlike
    localStorage.removeItem(likeKey);
    button.classList.remove('liked');
    let count = parseInt(likeCountSpan.textContent) || 0;
    count = Math.max(0, count - 1);
    likeCountSpan.textContent = count;
    
    // Update post data
    if (allPosts[postIndex]) {
      allPosts[postIndex].likes = count;
      updatePostsInStorage();
    }
  } else {
    // Like
    localStorage.setItem(likeKey, true);
    button.classList.add('liked');
    let count = parseInt(likeCountSpan.textContent) || 0;
    count++;
    likeCountSpan.textContent = count;
    
    // Update post data
    if (allPosts[postIndex]) {
      allPosts[postIndex].likes = count;
      updatePostsInStorage();
    }
  }
}

// 6. Comment functionality
let currentCommentPostIndex = null;

function openComments(postIndex) {
  currentCommentPostIndex = postIndex;
  const commentSection = document.getElementById('global-comment-section');
  const commentsList = document.getElementById('comments-list');
  
  // Load existing comments
  const post = allPosts[postIndex];
  const comments = post.comments || [];
  
  commentsList.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;';
    commentDiv.innerHTML = `
      <strong style="color: #ff3b5c;">${comment.user}</strong>
      <p style="margin: 5px 0 0 0;">${comment.text}</p>
    `;
    commentsList.appendChild(commentDiv);
  });
  
  commentSection.classList.add('active');
}

function closeComments() {
  document.getElementById('global-comment-section').classList.remove('active');
  document.getElementById('comment-input').value = '';
}

function addComment() {
  const input = document.getElementById('comment-input');
  const commentText = input.value.trim();
  
  if (!commentText || currentCommentPostIndex === null) return;
  
  const comment = {
    user: currentUser.name || currentUser.email,
    text: commentText,
    timestamp: new Date().toISOString()
  };
  
  // Add to post
  if (!allPosts[currentCommentPostIndex].comments) {
    allPosts[currentCommentPostIndex].comments = [];
  }
  allPosts[currentCommentPostIndex].comments.push(comment);
  
  // Update storage
  updatePostsInStorage();
  
  // Update comment count in UI
  const postDiv = document.querySelector(`[data-index="${currentCommentPostIndex}"]`);
  const commentCount = postDiv.querySelector('.comment-count');
  commentCount.textContent = allPosts[currentCommentPostIndex].comments.length;
  
  // Add to comments list
  const commentsList = document.getElementById('comments-list');
  const commentDiv = document.createElement('div');
  commentDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;';
  commentDiv.innerHTML = `
    <strong style="color: #ff3b5c;">${comment.user}</strong>
    <p style="margin: 5px 0 0 0;">${comment.text}</p>
  `;
  commentsList.appendChild(commentDiv);
  
  input.value = '';
}

// 7. Share functionality
function sharePost(videoUrl) {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this video on TestoRealm!',
      text: 'Amazing video I found on TestoRealm',
      url: window.location.href
    });
  } else {
    const shareText = `Check out this amazing video on TestoRealm: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert('📋 Link copied to clipboard!');
    }).catch(() => {
      alert('📤 Share this link: ' + window.location.href);
    });
  }
}

// 8. Utility functions
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 3600000) { // Less than 1 hour
    return Math.floor(diff / 60000) + 'm ago';
  } else if (diff < 86400000) { // Less than 1 day
    return Math.floor(diff / 3600000) + 'h ago';
  } else {
    return Math.floor(diff / 86400000) + 'd ago';
  }
}

function updatePostsInStorage() {
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const localPostsCount = localPosts.length;
  
  // Update only local posts (first N posts in allPosts array)
  for (let i = 0; i < Math.min(localPostsCount, allPosts.length); i++) {
    localPosts[i] = allPosts[i];
  }
  
  localStorage.setItem('posts', JSON.stringify(localPosts));
}

// 9. Logout function
function logout() {
  localStorage.removeItem('user');
  window.location.href = "login.html";
}

// 10. Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  
  // Close comments when clicking outside
  document.addEventListener('click', (e) => {
    const commentSection = document.getElementById('global-comment-section');
    if (e.target === commentSection) {
      closeComments();
    }
  });
  
  // Handle comment input enter key
  document.getElementById('comment-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addComment();
    }
  });
});
