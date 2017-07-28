console.log("STart");
document.addEventListener("DOMContentLoaded", () => {
  console.log("load");
  chrome.storage.sync.get(["fixedNavbar", "notify"], (v) => {
    console.log("done");
    document.getElementById("fixed-nav").checked = v["fixedNavbar"]
    document.getElementById("notify").checked = v["notify"]
  });
  document.getElementById("fixed-nav").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({fixedNavbar: e.target.checked}, () => {console.log("done");});
  })
  document.getElementById("notify").addEventListener("change", e => {
    console.log("change");
    chrome.storage.sync.set({notify: e.target.checked}, () => {console.log("done");});
  })
})
