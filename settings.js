document.addEventListener("DOMContentLoaded", function () {
  const savedPreference = localStorage.getItem('islamicPreference');
  if (savedPreference) {
    document.getElementById('islamicPreference').value = savedPreference;
  }
});

document.getElementById('settings-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const preference = document.getElementById('islamicPreference').value;
  localStorage.setItem('islamicPreference', preference);

  alert('Preference saved!');
});
