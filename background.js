let username = ""
const init = () => {
  console.log("Starting...");

  chrome.alarms.create("checkmessages", {
    periodInMinutes: 1.5
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
          chrome.browserAction.setBadgeText({text: msg_count + ""})
        }else{
          chrome.browserAction.setBadgeText({text: ""})
        }
      })
    }
  }
})

chrome.storage.onChanged.addListener((c, n) => {
  if (n === "sync") {
    username = c.username.newValue
  }
})
