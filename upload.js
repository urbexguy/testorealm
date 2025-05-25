document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const videoInput = document.getElementById('video-file');
  const video = videoInput.files[0];
  const description = document.getElementById('description').value.trim();
  const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

  if (!video) {
    alert("Please select a video file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const videoDataURL = event.target.result;

    const newPost = {
      id: Date.now(),
      video: videoDataURL,
      likes: 0,
      description: description,
      user: currentUser.name || 'Guest'
    };

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    alert("✅ Video uploaded successfully!");
    window.location.href = 'index.html';
  };

  reader.readAsDataURL(video);
});