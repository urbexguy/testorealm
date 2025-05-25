document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const fileInput = document.getElementById('videoFile');
    const descInput = document.getElementById('description');
    const statusDiv = document.getElementById('uploadStatus');
  
    const file = fileInput.files[0];
    const desc = descInput.value.trim();
  
    if (!file) {
      statusDiv.textContent = "Please choose a video.";
      return;
    }
  
    const videoURL = URL.createObjectURL(file);
  
    // Simulate saving to posts.json (in reality this would be a backend task)
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
  
    const newPost = {
      id: Date.now(),
      user: JSON.parse(localStorage.getItem('user'))?.name || "Anonymous",
      video: videoURL,
      likes: 0,
      description: desc
    };
  
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
  
    statusDiv.textContent = "✅ Video uploaded!";
    fileInput.value = "";
    descInput.value = "";
  });
  