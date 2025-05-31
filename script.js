// Auth check
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

let allPosts = [];
let currentPostIndex = 0;
let isLoading = false;
let hasMorePosts = true;

// Load posts function
async function loadPosts() {
  if (isLoading || !hasMorePosts) return;
  isLoading = true;

  const feed = document.getElementById('video-feed');
  const loading = document.getElementById('loading');
  
  try {
    // Load from posts.json (first time only)
    if (allPosts.length === 0) {
      try {
        const response = await fetch('posts.json');
        if (response.ok) {
          const jsonPosts = await response.json();
          allPosts = jsonPosts;
        }
      } catch (error) {
        console.error('❌ Error loading posts.json:', error);
      }

      // Load from localStorage
      const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
      allPosts = localPosts.concat(allPosts);
    }

    if (loading) loading.style.display = 'none';
    renderPosts();
    setupInfiniteScroll();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
  
  isLoading = false;
}

// Render posts
function renderPosts() {
  const feed = document.getElementById('video-feed');
  feed.innerHTML = '';
  
  allPosts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'video-post';
    postDiv.setAttribute('data-index', index);

    postDiv.innerHTML = `
      <video 
        src="${post.video}" 
        loop
        playsinline
        preload="metadata"
        muted
      ></video>
      
      <div class="post-overlay">
        <div class="post-header">
          <strong>@${post.user || 'Unknown'}</strong>
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

  setupVideoObserver();
  checkLikedPosts();
}

// Video observer for autoplay
function setupVideoObserver() {
  const videos = document.querySelectorAll('.video-post video');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersectionRatio > 0.5) {
        // Play video when 50% visible
        video.play().catch(e => console.log('Autoplay prevented'));
        video.currentTime = 0;
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => {
    observer.observe(video);
    // Tap to pause/play
    video.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
  });
}

// Infinite scroll
function setupInfiniteScroll() {
  const feed = document.querySelector('.video-feed');
  
  feed.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = feed;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMorePosts();
    }
  });
}

function loadMorePosts() {
  if (isLoading || !hasMorePosts) return;
  
  // Duplicate posts for infinite effect (in real app, fetch from server)
  const morePosts = [...allPosts].map(post => ({
    ...post,
    id: Date.now() + Math.random()
  }));
  
  allPosts = allPosts.concat(morePosts);
  renderPosts();
}

// Like function
function likePost(postIndex, button) {
  const likeKey = `liked_${postIndex}_${currentUser.email}`;
  const likeCountSpan = button.querySelector('.like-count');
  
  if (localStorage.getItem(likeKey)) {
    localStorage.removeItem(likeKey);
    button.classList.remove('liked');
    let count = parseInt(likeCountSpan.textContent) || 0;
    count = Math.max(0, count - 1);
    likeCountSpan.textContent = count;
  } else {
    localStorage.setItem(likeKey, true);
    button.classList.add('liked');
    let count = parseInt(likeCountSpan.textContent) || 0;
    count++;
    likeCountSpan.textContent = count;
  }
  
  if (allPosts[postIndex]) {
    allPosts[postIndex].likes = parseInt(likeCountSpan.textContent);
    updatePostsInStorage();
  }
}

// Check liked posts
function checkLikedPosts() {
  document.querySelectorAll('.like-btn').forEach((btn, index) => {
    const likeKey = `liked_${index}_${currentUser.email}`;
    if (localStorage.getItem(likeKey)) {
      btn.classList.add('liked');
    }
  });
}

// Comments
let currentCommentPostIndex = null;

function openComments(postIndex) {
  currentCommentPostIndex = postIndex;
  const commentSection = document.getElementById('global-comment-section');
  const commentsList = document.getElementById('comments-list');
  
  const post = allPosts[postIndex];
  const comments = post.comments || [];
  
  commentsList.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;';
    commentDiv.innerHTML = `
      <strong style="color: #fe2c55;">${comment.user}</strong>
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
  
  if (!allPosts[currentCommentPostIndex].comments) {
    allPosts[currentCommentPostIndex].comments = [];
  }
  allPosts[currentCommentPostIndex].comments.push(comment);
  
  updatePostsInStorage();
  
  const postDiv = document.querySelector(`[data-index="${currentCommentPostIndex}"]`);
  const commentCount = postDiv.querySelector('.comment-count');
  commentCount.textContent = allPosts[currentCommentPostIndex].comments.length;
  
  const commentsList = document.getElementById('comments-list');
  const commentDiv = document.createElement('div');
  commentDiv.style.cssText = 'margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;';
  commentDiv.innerHTML = `
    <strong style="color: #fe2c55;">${comment.user}</strong>
    <p style="margin: 5px 0 0 0;">${comment.text}</p>
  `;
  commentsList.appendChild(commentDiv);
  
  input.value = '';
}

// Share function
function sharePost(videoUrl) {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this video on TestoRealm!',
      text: 'Amazing video I found on TestoRealm',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('📋 Link copied!');
    }).catch(() => {
      alert('📤 Share: ' + window.location.href);
    });
  }
}

// Utility functions
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
  return Math.floor(diff / 86400000) + 'd';
}

function updatePostsInStorage() {
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const localPostsCount = localPosts.length;
  
  for (let i = 0; i < Math.min(localPostsCount, allPosts.length); i++) {
    localPosts[i] = allPosts[i];
  }
  
  localStorage.setItem('posts', JSON.stringify(localPosts));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  
  // Close comments on outside click
  document.addEventListener('click', (e) => {
    const commentSection = document.getElementById('global-comment-section');
    if (e.target === commentSection) closeComments();
  });
  
  // Enter key for comments
  document.getElementById('comment-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addComment();
  });
});
