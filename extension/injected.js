// Check if it is the new Scratch look.
const isUpdatedPage = !!document.querySelector("#navigation > .inner")

// Store path for later use.
const path = window.location.pathname

// Define global search filter variable.
let searchFilter = ""
const searchBox = document.querySelector("input[placeholder=Search]")

// Set the username variable to the current user's name.
if (document.querySelector(isUpdatedPage ? ".profile-name" : ".user-name")) {
  const username = document.querySelector(isUpdatedPage ? ".profile-name" : ".user-name").textContent
  chrome.storage.sync.set({username}, () => {});
}

<<<<<<< HEAD
// Load settings from Chrome Sync
chrome.storage.sync.get(["fixedNavbar", "bbDiscuss", "bbWiki", "forumPopoutReply"], (v) => {
  // #BringItBack
  if (v["bbDiscuss"]) document.querySelector(isUpdatedPage ? ".link.tips" : "li:nth-child(3)").innerHTML = "<a href=\"/discuss\">Discuss</a>"
  if (v["bbWiki"]) document.querySelector(isUpdatedPage ? ".link.about" : "li:nth-child(4)").innerHTML = "<a href=\"http://wiki.scratch.mit.edu\">Wiki</a>"

  // Popout reply box
  if (v["forumPopoutReply"] && document.querySelector("#id_body.markItUpEditor")) {
    document.querySelector("#reply").className = "furball-popout-reply box"
    document.querySelector("#id_body.markItUpEditor").placeholder = "Reply..."
    document.querySelector("#id_body.markItUpEditor").addEventListener("focus", e => {
      document.querySelector(".form-submit button").className = "furball-reply-submit-button"
    })
    document.querySelector("#id_body.markItUpEditor").addEventListener("blur", e => {
      setTimeout(() => {
        document.querySelector(".form-submit button").className = "button grey"
      }, 10)
    })
  }

  // Fixed navbar
=======
// Load the navbar settings.
chrome.storage.sync.get(["fixedNavbar"], (v) => {
>>>>>>> parent of 532808b... Add settings for #bringItBack stuff
  document.querySelector(isUpdatedPage ? "#navigation" : "#topnav").style.position = v["fixedNavbar"] ? "fixed" : "static"
  if (isUpdatedPage) {
    document.querySelector("#view").style.marginTop = v["fixedNavbar"] ? "50px" : "0px";
  }else{
    document.querySelector("#content").style.paddingTop = v["fixedNavbar"] ? "50px" : "15px";
  }
});

// Add back the Discuss tab.
document.querySelector(isUpdatedPage ? ".link.tips" : "li:nth-child(3)").innerHTML = "<a href=\"/discuss\">Discuss</a>"
document.querySelector(isUpdatedPage ? ".link.about" : "li:nth-child(4)").innerHTML = "<a href=\"http://wiki.scratch.mit.edu\">Wiki</a>"

// Use a better search.
document.querySelector(isUpdatedPage ? "ul > .search > form" : ".container > .search").addEventListener("submit", e => {
  e.preventDefault()
  const query = searchBox.value
  if (searchFilter === "forum") {
    window.location.assign("https://google.com/search?q=site%3Ascratch.mit.edu%2Fdiscuss+" + encodeURIComponent(query).replace(/%20/g, "+"))
  }else{
    const unameRegex = /^@([a-zA-Z0-9\-_]+)$/
    if (unameRegex.test(query)) {
      window.location.assign("https://scratch.mit.edu/users/" + query.match(unameRegex)[1])
    }else{
      window.location.assign("https://google.com/search?q=site%3Ascratch.mit.edu+" + encodeURIComponent(query).replace(/%20/g, "+"))
    }
  }
})

// On blur, clear filters
searchBox.addEventListener("blur", e => {
  searchFilter = ""
  searchBox.placeholder = "Search"
})

// Is it a discuss page
if (/^\/discuss/.test(path)) {
  // Fix the search
  document.querySelector("#navsearch > a").addEventListener("click", e => {
    e.preventDefault()
    searchFilter = "forum"
    searchBox.placeholder = "Search Discussion Forums"
    searchBox.focus()
    searchBox.select()
  })
}

// Is it a sub-forum page?
if (/^\/discuss\/([0-9]+)\/?$/.test(path)) {
  // If a sub-forum is paginated,
  if (document.querySelector(".pagination")) {
    // ... add infinite scroll
    const maxPage = parseInt(document.querySelector(".pagination > .page:nth-last-child(2)").innerHTML)
    let nextPageToLoad = 1
    let isLoading = false
    window.addEventListener("scroll", e => {
      if (document.body.scrollHeight - document.body.scrollTop < document.body.clientHeight + 340) {
        if (!isLoading && nextPageToLoad < maxPage) {
          isLoading = true
          nextPageToLoad++
          fetch("https://scratch.mit.edu/discuss/" + path.match(/^\/discuss\/([0-9]+)/)[1] + "/?page=" + nextPageToLoad).then(r => {
            return r.text()
          }).then(t => {
            const content = t.slice(t.indexOf("<tbody>") + 7, t.indexOf("</tbody>"))
            document.querySelector(".box-content > table > tbody").innerHTML += content
            isLoading = false;
          }).catch(e => {
            console.error(e)
          })
        }
      }
    })
  }
}

// Is it My Stuff
if (/^\/mystuff\/?$/.test(path)) {
  // Add infinite scroll
  window.addEventListener("scroll", e => {
    if (document.body.scrollHeight - document.body.scrollTop < document.body.clientHeight + 300) {
      document.querySelector("[data-control=load-more]").click()
    }
  })
}

// Is it a project
if (/^\/projects\/([0-9]+)\/?$/.test(path)) {
  // Add switch to phosphorus button
  const pid = path.match(/^\/projects\/([0-9]+)\/?$/)[1]

  let phosphorusFrame = document.createElement("iframe")
  phosphorusFrame.src = `https://phosphorus.github.io/embed.html?id=${pid}&auto-start=false`
  phosphorusFrame.width = "482"
  phosphorusFrame.height = "393"
  phosphorusFrame.className = "furball-hidden"
  phosphorusFrame.allowFullscreen = true

  document.getElementById("player").appendChild(phosphorusFrame)

  let phosphorusToggle = document.createElement("div")
  phosphorusToggle.className = "action tooltip bottom"
  phosphorusToggle.innerHTML = `<span class="hovertext"><span class="arrow"></span>Use the Phosphorus Player Instead</span><span class="dropdown-toggle text black">Toggle Phosphorus</span>`
  phosphorusToggle.addEventListener("click", e => {
    if (phosphorusFrame.className === "furball-ph-frame") {
      phosphorusFrame.className = "furball-hidden"
      document.getElementById("scratch").className = ""
      document.querySelector("#see-inside").className = "button"
      document.querySelector(".see-inside.icon").className = "see-inside icon white"
      document.querySelector("#project .box-head .buttons > a").style.pointerEvents = "all"
    }else{
      phosphorusFrame.className = "furball-ph-frame"
      document.getElementById("scratch").className = "furball-hidden"
      document.querySelector("#see-inside").className = "button grey"
      document.querySelector(".see-inside.icon").className = "see-inside icon gray"
      document.querySelector("#project .box-head .buttons > a").style.pointerEvents = "none"
    }
  })

  document.getElementById("cloud-log").insertAdjacentElement("afterend", phosphorusToggle)
}
