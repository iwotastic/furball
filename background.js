let username = ""
let prevNotificationAmt = 0
const init = () => {
  console.log("Starting...");

  chrome.alarms.create("checkmessages", {
    periodInMinutes: 1
  })

  console.log("Alarm created!");

  chrome.storage.sync.get(["username"], (v) => { username = v["username"] });

  console.log("Username fetched!");
}

init()

chrome.alarms.onAlarm.addListener(a => {
  console.log("Alarm recieved.");
  if (a.name === "checkmessages") {
    console.log("Check recieved.");
    if (username !== "") {
      console.log("Checking messages...");
      fetch(`https://api.scratch.mit.edu/proxy/users/${username}/activity/count`).then(r => r.json()).then(({msg_count}) => {
        if (msg_count > 0) {
          if (msg_count > prevNotificationAmt) {
            chrome.notifications.create({
              type: "basic",
              iconUrl: "icon128x128.png",
              title: "New Scratch Message!",
              message: "You now have " + msg_count + " message" + (msg_count === 1 ? "" : "s") + " on Scratch, click to view."
            })
          }
          chrome.browserAction.setBadgeText({text: msg_count + ""})
        }else{
          chrome.browserAction.setBadgeText({text: ""})
        }
        prevNotificationAmt = msg_count
      })
    }
  }
})

chrome.notifications.onClicked.addListener(id => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/messages"
  })
})

chrome.storage.onChanged.addListener((c, n) => {
  if (n === "sync") {
    username = c.username.newValue
  }
})

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "https://scratch.mit.edu/messages"
  })
})
