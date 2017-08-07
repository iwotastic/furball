console.log("Start");
document.addEventListener("DOMContentLoaded", () => {
  console.log("load");
  chrome.storage.sync.get(["fixedNavbar", "notify", "bbDiscuss", "bbWiki", "forumPopoutReply"], (v) => {
    console.log("done");
    document.getElementById("fixed-nav").checked = v["fixedNavbar"]
    document.getElementById("notify").checked = v["notify"]
    document.getElementById("bb-discuss").checked = v["bbDiscuss"]
    document.getElementById("bb-wiki").checked = v["bbWiki"]
  });
  document.getElementById("fixed-nav").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({fixedNavbar: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("notify").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({notify: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("bb-discuss").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({bbDiscuss: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("bb-wiki").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({bbWiki: e.target.checked}, () => {console.log("done");});
  })
})
