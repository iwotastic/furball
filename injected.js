// Check if it is the new Scratch look.
const isUpdatedPage = !!document.querySelector("#navigation > .inner")

// Store path for later use.
const path = window.location.pathname

// Define global search filter variable.
let searchFilter = ""
const searchBox = document.querySelector("input[placeholder=Search]")

// Add back the Discuss tab.
document.querySelector(isUpdatedPage ? ".link.tips" : "li:nth-child(3)").innerHTML = "<a href=\"/discuss\">Discuss</a>"

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
  // Remove studios panel if the project isn't in any
  if (document.querySelector(".galleries > .box-head > h4").textContent === "Studios (0)") {
    document.querySelector(".related > .col-5").remove()
    document.querySelector(".related > .col-11").className = "col-16"
  }
}
