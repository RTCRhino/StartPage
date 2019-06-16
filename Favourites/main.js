
document.addEventListener('DOMContentLoaded', () => {
  getSites();
});

// Runs when the site is created to add all of the sites to each categories
function getSites() {
  // Temporary fix to store categories
  const category = ["Productivity", "Stores", "Subreddits", "Movie Websites"];
  for (const i in category){
    // check to see if the category exists
    if (localStorage.getItem(category[i]) !== null) {
      // Retrieves it from local storage
      var categoryJSON = JSON.parse(window.localStorage.getItem(category[i]));
    }
    else {
      var categoryJSON = {
        name: category[i],
        contents: []
      }
    }
    // for each item inside given category add it to the site
    for (var item in categoryJSON["contents"]) {
      appendSite(categoryJSON["contents"][item].url, categoryJSON["contents"][item].name, categoryJSON["contents"][item].id, category[i])
    }
  }
}

// function which deals with the add new link Dialog
(function () {
  var addURLDialog = document.getElementById('newLinkDialog');
  var updateButton = document.getElementById('add-website');
  var category = document.getElementsByTagName('select')[0];
  var linkName = document.getElementById("name-input");
  var linkURL = document.getElementById("url-input");
  var confirmBtn = document.getElementById('confirmBtn');

  // “Update details” button opens the <dialog> modally
  updateButton.addEventListener('click', function onOpen() {
    if (typeof addURLDialog.showModal === "function") {
      addURLDialog.showModal();
    } else {
      alert("The dialog API is not supported by this browser");
    }
  });
  // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
  addURLDialog.addEventListener('close', function onClose() {
    if (addURLDialog.returnValue == "cancel") {
      //do nothing
    }
    else {
      // Check to see if the category is not null
      if (category.value !== "") {
        // Check to see if the local storage item has been pre-created
        if (localStorage.getItem(category.value) !== null) {
          // Retrieve the item from local storage
          var categoryJSON = JSON.parse(window.localStorage.getItem(category.value));
        }
        // Creates a new categoryJSON
        else {
          var categoryJSON = {};
          categoryJSON["name"] = category.value;
          categoryJSON["contents"] = [];
        }
        // Checks to see if the URL is a valid
        if (validateURL(linkURL.value) === true) {
          // creates a new ID taking the contents length and adding 1
          var linkID = categoryJSON["contents"].length + 1;
          // new object to add to contents containing all information for a new link
          const newcontent = {
            name: linkName.value,
            url: linkURL.value,
            id: linkID,
          }
          // Adds the new contents to the existing info
          categoryJSON["contents"].push(newcontent);
          // Stores information to local storage
          window.localStorage.setItem(category.value, JSON.stringify(categoryJSON));
          appendSite(linkURL.value, linkName.value, linkID, category.value);
        }
      }
    }
    // Resets the values of each thing in the Dialog so the fields are blank when reopened
    category.value = "";
    linkName.value = "";
    linkURL.value = "";
  });
})();

// function to add a new list item to a category
function appendSite(url, name, id, category) {
  let li = document.createElement("li");
    li.className = "fav-item";
    
    let anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.innerHTML = name;
    anchor.className = "fav";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    
    let icon = document.createElement("i");
    icon.className = "fa fa-trash-alt";
    icon.addEventListener("click", function() {deleteSite(url, name, id, category, li)});

    li.appendChild(anchor);
    li.appendChild(icon);

    // Gets parent element using the category name and adds a list item to it
    let element = document.getElementById(category);
    element.appendChild(li);
}

// Function to delete a site from the local storage and the website's category
function deleteSite(url, name, id, category, listItem) {
  // Parse in JSON file from local Storage
  var categoryJSON = JSON.parse(window.localStorage.getItem(category));
  for (var i in categoryJSON["contents"]){
    // Check to see if the name, url and ID all match the given Object
    if (url == categoryJSON["contents"][i]["url"] && name == categoryJSON["contents"][i]["name"] && id == categoryJSON["contents"][i]["id"]){
      // Remove item from list
      categoryJSON["contents"].splice(i, 1);
      // Restore the the information in local storage
      window.localStorage.setItem(category, JSON.stringify(categoryJSON));
      // Removes the html element
      listItem.remove();
    }
  }
}

//"Borrowed" from here: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validateURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function favHide(e) {
  var category = e.target.nextElementSibling;
  if (category.className.indexOf("fav-hide") == -1) {
    category.className += " fav-hide";
  } else {
    category.className = category.className.replace(" fav-hide", "");
  }
}

