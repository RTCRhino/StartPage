
document.addEventListener('DOMContentLoaded', () => {
  getSites();
});
// Runs when the site is created to add all of the sites to each categories
function getSites() {
  if (localStorage.getItem("categories") !== null) {
    var category = JSON.parse(localStorage.getItem("categories"));
  }
  else {
    var category = [];
  }
  for (const i in category) {
    createCategory(category[i])
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
  createBlankCategory();
}

// Adds the add category button. 
// This is done to ensure that the element is always last in the list.
function createBlankCategory() {
  section = document.createElement("section");
  section.className = "fav-section";

  section.id = "category-add";

  div = document.createElement("div");
  div.className = "fav-category";

  button = document.createElement("button");
  button.className = "category-add-button"
  button.addEventListener("click", function () { addCategory() });

  icon = document.createElement("i");
  icon.className = "fas fa-plus";
  button.appendChild(icon);

  div.appendChild(button);
  section.appendChild(div);

  let element = document.getElementById("fav-container");
  element.appendChild(section)
}

function addCategory() {
  var addCategoryDialog = document.getElementById('newCategoryDialog');
  var categoryInput = document.getElementById('add-category-name');

  addCategoryDialog.showModal();

  addCategoryDialog.addEventListener("close", function onClose() {
    if (addCategoryDialog.returnValue == "cancel") {
      //do nothing
    }
    else {
      // Check to see if the category is not null
      if (categoryInput.value !== "") {
        // Check to see if the local storage item has been pre-created
        if (localStorage.getItem("categories") !== null) {
          // Retrieve the item from local storage
          var categoryArray = JSON.parse(window.localStorage.getItem("categories"));
        }
        // Creates a new categoryJSON
        else {
          var categoryArray = [];
        }

        categoryArray.push(categoryInput.value);
        var categoryJSON = {};
        categoryJSON["name"] = categoryInput.value;
        categoryJSON["contents"] = [];

        localStorage.setItem("categories", JSON.stringify(categoryArray));
        localStorage.setItem(categoryInput.value, JSON.stringify(categoryJSON));

        removeBlankCategory();
        createCategory(categoryInput.value);
        createBlankCategory();

      }
    }
    // Resets the values of each input in the Dialog so the fields are blank when reopened
    categoryInput.value = "";
  });
}

// Removed the add category button after adding a category.
function removeBlankCategory() {
  let blankCategory = document.getElementById("category-add");
  blankCategory.parentNode.removeChild(blankCategory);
}

// Removed a category.
function removeCategory(divName) {
  localStorage.removeItem(divName);
  var categories = JSON.parse(localStorage.getItem("categories"));
  for (const i in categories){
    if (categories[i] == divName) {
      categories.splice(i, i);
    }
  }

  localStorage.setItem("categories", JSON.stringify(categories));
  let categorySection = document.getElementById(divName + "section");
  categorySection.parentNode.removeChild(categorySection);

  let categoryOption = document.getElementById(divName + "-option");
  categoryOption.parentNode.removeChild(categoryOption);
  
}

// Creates normal category
function createCategory(divName) {
  section = document.createElement("section");
  section.className = "fav-section";

  section.id = divName + "section";

  categoryDiv = document.createElement("div");
  categoryDiv.className = "fav-category";

  // Category title
  titleDiv = document.createElement("div");
  titleDiv.innerHTML = divName;
  titleDiv.className = "fav-title";

  removeButton = document.createElement("button");
  removeButton.className = "category-remove-button";
  removeButton.addEventListener("click", function() {removeCategory(divName)});

  icon = document.createElement("i");
  icon.className = "fas fa-times";
  removeButton.appendChild(icon);

  titleDiv.appendChild(removeButton);

  // Unordered list to store the links
  favList = document.createElement("ul");
  favList.className = "fav-list";
  favList.id = divName;

  categoryDiv.appendChild(titleDiv);
  categoryDiv.appendChild(favList);

  section.appendChild(categoryDiv);

  let element = document.getElementById("fav-container");
  element.appendChild(section);

  categoryOption = document.createElement("option");
  categoryOption.value = divName;
  categoryOption.innerHTML = divName;
  categoryOption.id = divName + "-option"

  var categoryDropDown = document.getElementById("category-input");
  categoryDropDown.appendChild(categoryOption);
}

// function which deals with the add new link Dialog
(function () {
  var addURLDialog = document.getElementById('newLinkDialog');
  var updateButton = document.getElementById('add-website');
  var category = document.getElementById('category-input');
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
          localStorage.setItem(category.value, JSON.stringify(categoryJSON));
          appendSite(linkURL.value, linkName.value, linkID, category.value);
        }
      }
    }
    // Resets the values of each input in the Dialog so the fields are blank when reopened
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
  icon.addEventListener("click", function () { deleteSite(url, name, id, category, li) });

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
  for (var i in categoryJSON["contents"]) {
    // Check to see if the name, url and ID all match the given Object
    if (url == categoryJSON["contents"][i]["url"] && name == categoryJSON["contents"][i]["name"] && id == categoryJSON["contents"][i]["id"]) {
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

/*
function favHide(e) {
  var category = e.target.nextElementSibling;
  if (category.className.indexOf("fav-hide") == -1) {
    category.className += " fav-hide";
  } else {
    category.className = category.className.replace(" fav-hide", "");
  }
}
*/
