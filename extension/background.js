let username = ""
let notify = true
let badge = true
let prevNotificationAmt = 0
const init = () => {
  console.log("Starting...");

  chrome.alarms.create("checkmessages", {
    periodInMinutes: 1
  })

  console.log("Alarm created!");

  chrome.storage.sync.get(["username", "notify"], (v) => { username = v.username || ""; notify = v.notify });

  console.log("Username fetched!", username);
}

init()

chrome.alarms.onAlarm.addListener(a => {
  console.log("Alarm recieved.");
  if (a.name === "checkmessages" && notify) {
    console.log("Check recieved.");
    if (username !== "") {
      console.log("Checking messages...");
      fetch(`https://api.scratch.mit.edu/proxy/users/${username}/activity/count`).then(r => r.json()).then(({msg_count}) => {
        if (msg_count > 0) {
          if (msg_count > prevNotificationAmt) {
            chrome.notifications.create({
              type: "basic",
              iconUrl: "icon128x128.png",
              title: "New Scratch Message" + (msg_count - prevNotificationAmt > 1 ? "s" : "") + "!",
              message: "You now have " + msg_count + " message" + (msg_count === 1 ? "" : "s") + " on Scratch, click to view."
            });
          }
          chrome.browserAction.setBadgeText({text: (badge ? msg_count : "") + ""});
        }else{
          chrome.browserAction.setBadgeText({text: ""});
        }
        prevNotificationAmt = msg_count;
      });
    }
  }
});

chrome.notifications.onClicked.addListener(id => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/messages"
  });
});

chrome.storage.onChanged.addListener((c, n) => {
  if (n === "sync") {
    username = (c.username || {newValue: username}).newValue;
    notify = (c.notify || {newValue: notify}).newValue;
    badge = (c.badge || {newValue: badge}).newValue;
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/messages"
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["fixedNavbar", "notify", "bbDiscuss", "bbwiki", "badge", "searchEngine"], (v) => {
    if (v["fixedNavbar"] == null || v["fixedNavbar"] == undefined) {
      chrome.storage.sync.set({fixedNavbar: true}, () => {});
    }
    if (v["notify"] == null || v["notify"] == undefined) {
      chrome.storage.sync.set({notify: true}, () => {});
    }
    if (v["bbDiscuss"] == null || v["bbDiscuss"] == undefined) {
      chrome.storage.sync.set({bbDiscuss: true}, () => {});
    }
    if (v["bbWiki"] == null || v["bbWiki"] == undefined) {
      chrome.storage.sync.set({bbWiki: false}, () => {});
    }
    if (v["badge"] == null || v["badge"] == undefined) {
      chrome.storage.sync.set({badge: true}, () => {});
    }
    if (v["searchEngine"] == null || v["searchEngine"] == undefined) {
      chrome.storage.sync.set({searchEngine: "google"}, () => {});
    }
  });
});
