document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const videoInput = document.getElementById('video-file');
  const video = videoInput.files[0];
  const description = document.getElementById('description').value.trim();
  const user = JSON.parse(localStorage.getItem('user'))?.name || 'Unknown User';

  if (!video) {
    alert("Please select a video file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const videoDataURL = event.target.result;

    const post = {
      id: Date.now(),
      user: user,
      video: videoDataURL,
      description: description,
      likes: 0
    };

    let posts = JSON.parse(localStorage.getItem('user_posts')) || [];
    posts.unshift(post);
    localStorage.setItem('user_posts', JSON.stringify(posts));

    alert("Video uploaded successfully!");
    window.location.href = 'index.html'; // redirect to home
  };

  reader.readAsDataURL(video);
});
