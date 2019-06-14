function favHide(e) {
  var category = e.target.nextElementSibling;
  if (category.className.indexOf("fav-hide") == -1) {
    category.className += " fav-hide";
  } else {
    category.className = category.className.replace(" fav-hide", "");
  }
}

(function() {
  debugger;
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

      const categoryJSON = JSON.parse(window.localStorage.getItem(category.value));

      const newcontent = {
        name: linkName.value,
        url: linkURL.value,
      }

      categoryJSON["contents"].push(newcontent);

      window.localStorage.setItem(category.value, JSON.stringify(categoryJSON));

      console.log(window.localStorage.getItem(category.value));
    }
  });
})();
