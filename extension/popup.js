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
document.getElementById("night-mode").addEventListener("click", e => {
  chrome.storage.sync.get(["nightMode"], (v) => { chrome.storage.sync.set({nightMode: !v["nightMode"]}, () => { setNightModeIcon() }); })
})
function setNightModeIcon() {
  chrome.storage.sync.get(["nightMode"], (v) => { document.getElementById("night-mode").innerHTML = v["nightMode"] ? "brightness_7" : "brightness_3" })
}
setNightModeIcon()
