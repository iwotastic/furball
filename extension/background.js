chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkmessages", {
    periodInMinutes: 1
  })

  chrome.storage.sync.set({prevNotificationAmt: 0}, () => {});

  chrome.storage.sync.get(["fixedNavbar", "notify", "bbDiscuss", "bbWiki", "badge", "searchEngine"], (v) => {
    if (v["fixedNavbar"] === null || v["fixedNavbar"] === undefined) {
      chrome.storage.sync.set({fixedNavbar: true}, () => {});
    }
    if (v["notify"] === null || v["notify"] === undefined) {
      chrome.storage.sync.set({notify: true}, () => {});
    }
    if (v["bbDiscuss"] === null || v["bbDiscuss"] === undefined) {
      chrome.storage.sync.set({bbDiscuss: true}, () => {});
    }
    if (v["bbWiki"] === null || v["bbWiki"] === undefined) {
      chrome.storage.sync.set({bbWiki: false}, () => {});
    }
    if (v["badge"] === null || v["badge"] === undefined) {
      chrome.storage.sync.set({badge: true}, () => {});
    }
    if (v["searchEngine"] === null || v["searchEngine"] === undefined) {
      chrome.storage.sync.set({searchEngine: "google"}, () => {});
    }
    if (v["scrollableQuotes"] === null || v["scrollableQuotes"] === undefined) {
      chrome.storage.sync.set({scrollableQuotes: true}, () => {});
    }
    if (v["autoEmbed"] === null || v["autoEmbed"] === undefined) {
      chrome.storage.sync.set({autoEmbed: true}, () => {});
    }
    if (v["linkify"] === null || v["linkify"] === undefined) {
      chrome.storage.sync.set({linkify: true}, () => {});
    }
  });
});

chrome.alarms.onAlarm.addListener(a => {
  console.log("Alarm recieved.");
  chrome.storage.sync.get(["username", "notify", "prevNotificationAmt", "badge"], ({username, notify, prevNotificationAmt, badge}) => {
    if (a.name === "checkmessages" && notify) {
      console.log("Check recieved.");
      if (username !== "") {
        console.log("Checking messages...");
        fetch(`https://api.scratch.mit.edu/proxy/users/${username}/activity/count`).then(r => r.json()).then(({msg_count}) => {
          console.log("Diff n, o, in", msg_count, prevNotificationAmt, msg_count > prevNotificationAmt);
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
          chrome.storage.sync.set({prevNotificationAmt: msg_count}, () => {});
        });
      }
    }
  });
});

chrome.notifications.onClicked.addListener(id => {
  if (id === "update_info") {
    chrome.tabs.create({
      url: "https://github.com/iwotastic/furball/releases/latest"
    });
  }else{
    chrome.tabs.create({
      url: "https://scratch.mit.edu/messages"
    });
  }
});

chrome.runtime.onInstalled.addListener(reason => {
  if (reason === "update") {
    chrome.notifications.create("update_info", {
      type: "basic",
      iconUrl: "icon128x128.png",
      title: "Update Get!",
      message: "Furball's is now on version " + chrome.runtime.getManifest().version + ", click to view update info."
    });
  }
})
