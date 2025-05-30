document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert('You must be logged in to upload videos!');
    window.location.href = 'login.html';
    return;
  }
});

document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const videoInput = document.getElementById('video-file');
  const video = videoInput.files[0];
  const description = document.getElementById('description').value.trim();
  const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
  const statusDiv = document.getElementById('uploadStatus');

  if (!video) {
    statusDiv.innerHTML = '<p style="color: red;">❌ Please select a video file.</p>';
    return;
  }

  // Show upload progress
  statusDiv.innerHTML = '<p style="color: yellow;">⏳ Uploading video...</p>';
  
  // Disable form during upload
  document.getElementById('upload-form').style.pointerEvents = 'none';
  document.getElementById('upload-form').style.opacity = '0.6';

  const reader = new FileReader();
  reader.onload = function (event) {
    const videoDataURL = event.target.result;

    const newPost = {
      id: Date.now(),
      video: videoDataURL,
      likes: 0,
      description: description || "No description",
      user: currentUser.name || currentUser.email || 'Guest',
      timestamp: new Date().toISOString()
    };

    // Save to both user posts and general posts
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
    
    posts.unshift(newPost);
    userPosts.unshift(newPost);
    
    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('user_posts', JSON.stringify(userPosts));

    statusDiv.innerHTML = '<p style="color: green;">✅ Video uploaded successfully!</p>';
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  };

  reader.onerror = function() {
    statusDiv.innerHTML = '<p style="color: red;">❌ Error uploading video. Please try again.</p>';
    document.getElementById('upload-form').style.pointerEvents = 'auto';
    document.getElementById('upload-form').style.opacity = '1';
  };

  reader.readAsDataURL(video);
});
// Video preview functionality
document.getElementById('video-file').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const previewDiv = document.getElementById('video-preview');
  const previewVideo = document.getElementById('preview-video');

  if (file) {
    const url = URL.createObjectURL(file);
    previewVideo.src = url;
    previewDiv.style.display = 'block';
  } else {
    previewDiv.style.display = 'none';
  }
});
