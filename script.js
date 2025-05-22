const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

fetch('posts.json')
  .then(response => {
    if (!response.ok) throw new Error("HTTP status " + response.status);
    return response.json();
  })
  .then(posts => {
    const feed = document.getElementById('video-feed');
    posts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'video-post';

    postDiv.innerHTML = `
  <div class="post-header">
    <strong>📤 ${post.user || 'Unknown User'}</strong>
  </div>
  <div class="video-wrapper">
    <video src="${post.video}" controls></video>
    <div class="post-actions">
      <button onclick="likePost(this)">❤️ Like <span class="like-count">${post.likes}</span></button>
      <button onclick="commentPost(this)">💬 Comment</button>
    </div>
  </div>
`;

      feed.appendChild(postDiv);
    });
  })
  .catch(error => {
    console.error('❌ Error loading posts:', error);
    document.getElementById('video-feed').innerHTML = "<p style='color: red;'>Failed to load posts. Check console.</p>";
  });

function likePost(button) {
  const post = button.closest('.video-post');
  const postIndex = Array.from(document.querySelectorAll('.video-post')).indexOf(post);
  const likeKey = `liked_${postIndex}`;

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
        comment.textContent = commentText;
        commentSection.appendChild(comment);
        input.value = '';
      }
    };

    commentSection.appendChild(input);
    commentSection.appendChild(sendBtn);
    post.appendChild(commentSection);
  }
}
