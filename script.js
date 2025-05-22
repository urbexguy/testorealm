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
  const countSpan = button.querySelector('.like-count');
  let count = parseInt(countSpan.textContent);
  count++;
  countSpan.textContent = count;
}

function commentPost(button) {
  const post = button.closest('.video-post');

  if (!post) {
    console.error("Could not find the video-post container.");
    return;
  }

  // Check if the comment section already exists
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

