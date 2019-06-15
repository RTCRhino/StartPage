document.addEventListener('DOMContentLoaded', () => {
  getSites();
});

function getSites() {
  const category = ["Productivity", "Stores", "Subreddits", "Movie Websites"];
  for (const i in category){
    if (localStorage.getItem(category[i]) !== null) {
      var categoryJSON = JSON.parse(window.localStorage.getItem(category[i]));
    }
    else {
      var categoryJSON = {
        contents: []
      }
    }
    for (var item in categoryJSON["contents"]) {
      appendSite(categoryJSON["contents"][item].url, categoryJSON["contents"][item].name, category[i])
    }
  }
}

function favHide(e) {
  var category = e.target.nextElementSibling;
  if (category.className.indexOf("fav-hide") == -1) {
    category.className += " fav-hide";
  } else {
    category.className = category.className.replace(" fav-hide", "");
  }
}

function appendSite(url, name, category) {
  let li = document.createElement("li");
    li.className = "fav-item";
    let anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.innerHTML = name;
    anchor.className = "fav";
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    
    li.appendChild(anchor);

    let element = document.getElementById(category);
    element.appendChild(li);
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

(function () {
  var addURLDialog = document.getElementById('newLinkDialog');
  var updateButton = document.getElementById('updateDetails');

  //var outputBox = document.getElementsByTagName('output')[0];
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
      //get category JSON
      //get name
      //get link
      //add to local storage via Category Key
      //refresh list.
      //
      //Get existing category from localstorage.
      //Append new link data to existing contents array.
      //Set category to local storage.

      /*
      const categoryJSON = {
        name: category.value,
        contents: [
          {name: linkName.value, url: linkURL.value},
          {name: linkName.value, url: linkURL.value},
          {name: linkName.value, url: linkURL.value}
        ]
      }
      window.localStorage.setItem(category.value, JSON.stringify(categoryJSON));
      console.log(window.localStorage.getItem(category.value));
      */
      if (category.value !== "") {
        if (localStorage.getItem(category.value) !== null) {
          var categoryJSON = JSON.parse(window.localStorage.getItem(category.value));
        }
        else {
          var categoryJSON = {};
          categoryJSON["name"] = category.value;
          categoryJSON["contents"] = [];
        }

        if (validURL(linkURL.value) === true) {
          const newcontent = {
            name: linkName.value,
            url: linkURL.value,
          }
          categoryJSON["contents"].push(newcontent);
          window.localStorage.setItem(category.value, JSON.stringify(categoryJSON));
          console.log(window.localStorage.getItem(category.value));

          appendSite(linkURL.value, linkName.value, category.value);
        }
      }
    }
  });
})();
