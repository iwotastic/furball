console.log("Start");
document.addEventListener("DOMContentLoaded", () => {
  console.log("load");
  chrome.storage.sync.get(["fixedNavbar", "notify", "bbDiscuss", "bbWiki", "badge", "searchEngine", "username", "scrollableQuotes", "autoEmbed", "linkify"], (v) => {
    console.log("done");
    document.getElementById("fixed-nav").checked = v["fixedNavbar"]
    document.getElementById("notify").checked = v["notify"]
    document.getElementById("bb-discuss").checked = v["bbDiscuss"]
    document.getElementById("bb-wiki").checked = v["bbWiki"]
    document.getElementById("badge").checked = v["badge"]
    document.getElementById("search-engine").value = v["searchEngine"]
    document.getElementById("uname").innerHTML = v["username"]
    document.getElementById("scrollable-quotes").checked = v["scrollableQuotes"]
    document.getElementById("linkify").checked = v["linkify"]
    document.getElementById("auto-embed").checked = v["autoEmbed"]
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
  document.getElementById("badge").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({badge: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("search-engine").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({searchEngine: e.target.value}, () => {console.log("done");});
  })
  document.getElementById("scrollable-quotes").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({scrollableQuotes: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("auto-embed").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({autoEmbed: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("linkify").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({linkify: e.target.checked}, () => {console.log("done");});
  })
})
