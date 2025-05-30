function goTo(page) {
  switch (page) {
    case "home":
      window.location.href = "index.html";
      break;
    case "upload":
      window.location.href = "upload.html";
      break;
    case "profile":
      window.location.href = "profile.html";
      break;
    case "settings":
      window.location.href = "settings.html";
      break;
    default:
      alert("Unknown page: " + page);
  }
}
