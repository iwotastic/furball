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

// Load settings from Chrome Sync
chrome.storage.sync.get(["fixedNavbar", "bbDiscuss", "bbWiki", "searchEngine"], (v) => {
  // #BringItBack
  if (v["bbDiscuss"]) {
    document.querySelector(isUpdatedPage ? ".link.tips" : "li:nth-child(3)").innerHTML = "<a href=\"https://scratch.mit.edu/discuss\">Discuss</a>"
  }
  if (v["bbWiki"]) {
    document.querySelector(isUpdatedPage ? ".link.about" : "li:nth-child(4)").innerHTML = "<a href=\"https://wiki.scratch.mit.edu\">Wiki</a>"
  }

  document.querySelector(isUpdatedPage ? "#navigation" : "#topnav").style.position = v["fixedNavbar"] ? "fixed" : "static"
  if (isUpdatedPage) {
    document.querySelector("#view").style.marginTop = v["fixedNavbar"] ? "50px" : "0px";
  }else{
    document.querySelector("#content").style.paddingTop = v["fixedNavbar"] ? "50px" : "15px";
  }

  // Use a better search.
  document.querySelector(isUpdatedPage ? "ul > .search > form" : ".container > .search").addEventListener("submit", e => {
    e.preventDefault()
    const query = searchBox.value
    const searchSites = {
      google: "https://google.com/search?q=site%3Ascratch.mit.edu%2F",
      bing: "https://bing.com/search?q=site%3Ascratch.mit.edu%2F",
      ddg: "https://duckduckgo.com/?q=site%3Ascratch.mit.edu%2F",
      sse: "https://scratch.mit.edu/search/projects?q="
    }
    if (searchFilter === "forum") {
      window.location.assign((v["searchEngine"] !== "sse" ? searchSites[v["searchEngine"]] + "discuss%20" : "https://google.com/search?q=site%3Ascratch.mit.edu%2Fdiscuss%20") + encodeURIComponent(query))
    }else{
      const unameRegex = /^@([a-zA-Z0-9\-_]+)$/
      if (unameRegex.test(query)) {
        window.location.assign("https://scratch.mit.edu/users/" + query.match(unameRegex)[1])
      }else{
        window.location.assign(searchSites[v["searchEngine"]] + "%20" + encodeURIComponent(query).replace(/%20/g, "+"))
      }
    }
  })
});

// Add back the Discuss tab.
document.querySelector(isUpdatedPage ? ".link.tips" : "li:nth-child(3)").innerHTML = "<a href=\"https://scratch.mit.edu/discuss\">Discuss</a>"
document.querySelector(isUpdatedPage ? ".link.about" : "li:nth-child(4)").innerHTML = "<a href=\"https://wiki.scratch.mit.edu\">Wiki</a>"

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

// Does it have a rich text editor
if (document.querySelector(".markItUpHeader")) {
  const replaces = {
    "1": "format_bold",
    "2": "format_italic",
    "3": "format_underlined",
    "4": "strikethrough_s",
    "5": "insert_photo",
    "6": "link",
    "7": "format_size",
    "8": "format_list_bulleted",
    "9": "format_list_numbered",
    "10": "playlist_add",
    "11": "insert_comment",
    "12": "insert_emoticon",
    "13": "language",
    "14": "clear_all",
    "15": "check_circle",
    "16": "web"
  }
  for (var rep in replaces) {
    document.querySelector(".markItUpButton" + rep + " > a").innerHTML = replaces[rep]
    document.querySelector(".markItUpButton" + rep + " > a").className = "furball-mi"
  }
}

if (/^\/discuss\/topic\/([0-9]+)\/?$/.test(path)) {
  // Username linkifier (based on https://scratch.mit.edu/discuss/post/2776608/ with a few modifications)
  Array.from(document.querySelectorAll(".post_body_html,.postsignature")).forEach(post => post.innerHTML = post.innerHTML.replace(/(@([a-zA-Z0-9_-]{2,}))/g, '<a href="https://scratch.mit.edu/users/$2/">$1</a>'));
}

// Is it a project
if (/^\/projects\/([0-9]+)\/?$/.test(path)) {
  // Add function to install the Furball Extension Suite
  setTimeout(() => {
    const install = () => {
      fetch("https://savaka2.github.io/scratch-extensions-directory/list.js").then(r => r.text()).then(txt => {
        const extData = JSON.parse(txt.slice(17, -1).replace(/\n/g, "").replace(/\/\*.*\*\//g, "").replace(/'/g, "\""))
        var easyLoadExts = {}
        extData.filter(e => /^w?$/.test(e.type)).forEach(e => {
          easyLoadExts[e.title + " by " + e.author.join(", ")] = e.links.JavaScript
        })
        const eleNArr = (() => { var a = []; for (var e in easyLoadExts) { a.push(e); }; return a; })()
        const eleSArr = (() => { var a = []; for (var e in easyLoadExts) { a.push(easyLoadExts[e]); }; return a; })()
        window.furballExtensionsInstalled = []
        window.furballExtensionsToInstall = []
        ScratchExtensions.register("Furball", {
          blocks: [
            ["b", "Furball installed?", "fi"],
            ["w", "add extension from URL %s to list", "extReq"],
            ["w", "add %m.easyLoadExts to list", "eleExtReq"],
            ["w", "wait to install all listed extentions", "extIns"]
          ],
          menus: {
            easyLoadExts: eleNArr
          },
          url: "https://github.com/iwotastic/furball"
        }, {
          _shutdown() {},
          _getStatus() {
            return {status: 2, msg: "Good to go!"}
          },
          fi() { return true },
          extReq(url, cb) {
            if (url.trim() !== "" && url.length > 15) {
              window.furballExtensionsToInstall.push(url)
            }else{
              console.log("Furball | User Error | Invalid URL: " + url)
            }
            cb()
          },
          eleExtReq(n, cb) {
            window.furballExtensionsToInstall.push(easyLoadExts[n])
            cb()
          },
          extIns(cb) {
            const confimationText = "𝓕𝓊𝓇𝒷𝒶𝓁𝓁:\nDo you allow this project to install the following extensions:\n" + window.furballExtensionsToInstall.map(v => {
              return "- " + (eleSArr.indexOf(v) !== -1 ? eleNArr[eleSArr.indexOf(v)] : "𝑓𝑟𝑜𝑚 𝑈𝑅𝐿 » " + v) + "\n"
            }).join("")
            if (confirm(confimationText)) {
              const installPromiseChain = window.furballExtensionsToInstall.filter(v => window.furballExtensionsInstalled.indexOf(v) === -1).map(v => new Promise((c, e) => {
                console.log("installing from " + v)
                var scriptToInstall = document.createElement("script")
                scriptToInstall.async = true
                scriptToInstall.src = (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("../") ? "" : "https://savaka2.github.io/scratch-extensions-directory/") + v.replace(/^http:\/\//, "https://").replace(/^\.\.\//, "https://savaka2.github.io/")
                scriptToInstall.addEventListener("load", () => {
                  console.log("done " + v)
                  c()
                })
                document.body.appendChild(scriptToInstall)
              }))
              Promise.all(installPromiseChain).then(() => {
                window.furballExtensionsInstalled = window.furballExtensionsToInstall
                window.furballExtensionsToInstall = []
                cb()
              })
            }else{
              alert("𝓕𝓊𝓇𝒷𝒶𝓁𝓁:\nThis project will now continue without any extensions, this may cause the project to be buggy or not work at all. To use this project with extensions reload this page.")
              window.furballExtensionsInstalled = window.furballExtensionsToInstall
              window.furballExtensionsToInstall = []
              cb()
            }
          }
        });
      })
    }
    var scrTag = document.createElement("script")
    scrTag.src = "data:text/javascript," + encodeURIComponent("window.setTimeout(()=>{(" + install.toString() + ")();},5000);")
    document.body.appendChild(scrTag)
  }, 5000)

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
    }else{
      phosphorusFrame.className = "furball-ph-frame"
      document.getElementById("scratch").className = "furball-hidden"
      document.querySelector("#see-inside").className = "button grey"
      document.querySelector(".see-inside.icon").className = "see-inside icon gray"
    }
  })

  document.getElementById("cloud-log").insertAdjacentElement("afterend", phosphorusToggle)
}
