document.addEventListener("DOMContentLoaded", function () {
  // Load saved preferences
  const savedIslamicPreference = localStorage.getItem('islamicPreference');
  const savedNotifications = localStorage.getItem('notifications');
  const savedAutoplay = localStorage.getItem('autoplay');
  
  if (savedIslamicPreference) {
    document.getElementById('islamicPreference').value = savedIslamicPreference;
  }
  
  if (savedNotifications) {
    document.getElementById('notifications').value = savedNotifications;
  }
  
  if (savedAutoplay) {
    document.getElementById('autoplay').value = savedAutoplay;
  }
});

document.getElementById('settings-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const islamicPreference = document.getElementById('islamicPreference').value;
  const notifications = document.getElementById('notifications').value;
  const autoplay = document.getElementById('autoplay').value;
  const statusDiv = document.getElementById('settings-status');
  
  // Save all preferences
  localStorage.setItem('islamicPreference', islamicPreference);
  localStorage.setItem('notifications', notifications);
  localStorage.setItem('autoplay', autoplay);

  // Show success message
  statusDiv.className = 'success';
  statusDiv.innerHTML = '✅ Settings saved successfully!';
  
  // Clear status after 3 seconds
  setTimeout(() => {
    statusDiv.innerHTML = '';
    statusDiv.className = '';
  }, 3000);
});
