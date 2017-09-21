document.getElementById("view-messages").addEventListener("click", e => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/messages"
  });
})
document.getElementById("new-project").addEventListener("click", e => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/projects/editor"
  });
})
document.getElementById("settings").addEventListener("click", e => {
  chrome.runtime.openOptionsPage();
})
