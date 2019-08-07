
document.addEventListener('DOMContentLoaded', () => {
  getSites();
});

// Runs when the site is created to add all of the sites to each categories
function getSites() {
  if (localStorage.getItem("categories") !== null) {
    var categoriesJSON = JSON.parse(localStorage.getItem("categories"));
  }
  else {
    var categoriesJSON = {};
  }
  for (const categoryName in categoriesJSON) {
    createCategory(categoryName);
    for (const item in categoriesJSON[categoryName]["contents"]) {
      appendSite(categoriesJSON[categoryName]["contents"][item].url,
        categoriesJSON[categoryName]["contents"][item].name,
        categoriesJSON[categoryName]["contents"][item].id,
        categoryName);
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

// Removed the add category button after adding a category.
function removeBlankCategory() {
  let blankCategory = document.getElementById("category-add");
  blankCategory.parentNode.removeChild(blankCategory);
}


function newCategory(category) {
  // Check to see if the category is not null
  if (category !== "") {
    // Check to see if the local storage item has been pre-created
    if (localStorage.getItem("categories") !== null) {
      // Retrieve the item from local storage
      var categoriesJSON = JSON.parse(window.localStorage.getItem("categories"));
    }
    // Creates a new categoryiesJSON
    else {
      var categoriesJSON = {};
    }

    categoriesJSON[category] = {};
    categoriesJSON[category]["contents"] = [];

    localStorage.setItem("categories", JSON.stringify(categoriesJSON));

    removeBlankCategory();
    createCategory(category);
    createBlankCategory();
  }
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
      newCategory(categoryInput.value);
    }
    // Resets the values of each input in the Dialog so the fields are blank when reopened
    categoryInput.value = "";
  });
}

// Removed a category.
function removeCategory(divName) {
  var categories = JSON.parse(localStorage.getItem("categories"));
  for (const i in categories) {
    if (i == divName) {
      delete categories[i];
    }
  }

  localStorage.setItem("categories", JSON.stringify(categories));
  let categorySection = document.getElementById(divName + "section");
  categorySection.parentNode.removeChild(categorySection);

  let categoryOption = document.getElementById(divName + "-option");
  categoryOption.parentNode.removeChild(categoryOption);

}

function editCategory(divName) {
  var editCategoryDialog = document.getElementById('editCategoryDialog');
  var categoryInput = document.getElementById('edit-category-name');

  editCategoryDialog.showModal();

  editCategoryDialog.addEventListener("close", function onClose() {
    if (editCategoryDialog.returnValue == "cancel") {
      //do nothing
    }
    else {
      var categoryInputValue = document.getElementById('edit-category-name').value;
      var categories = JSON.parse(localStorage.getItem("categories"));
      if (categories[divName])
      {
        debugger;
        newCategory(categoryInput.value);
        var categories = JSON.parse(localStorage.getItem("categories"));

        for (const j in categories[divName]["contents"]) {
          newURL(categories[divName]["contents"][j]["name"], categories[divName]["contents"][j]["url"], categoryInput.value);
        }
        removeCategory(divName);
      }
      
    }
    // Resets the values of each input in the Dialog so the fields are blank when reopened
    document.getElementById("edit-category-name").value = "";
  });
}

// Creates normal category
function createCategory(divName) {
  //Create category section
  section = document.createElement("section");
  section.className = "fav-section";

  section.id = divName + "section";

  categoryDiv = document.createElement("div");
  categoryDiv.className = "fav-category";

  // Category title
  titleDiv = document.createElement("div");
  titleDiv.innerHTML = divName;
  titleDiv.className = "fav-title";

  //Add categort edit button
  editButton = document.createElement("button");
  editButton.className = "category-edit-button";
  editButton.addEventListener("click", function () { editCategory(divName) });

  editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit";
  editButton.appendChild(editIcon);

  titleDiv.appendChild(editButton);

  //Add category remove button
  removeButton = document.createElement("button");
  removeButton.className = "category-remove-button";
  removeButton.addEventListener("click", function () { removeCategory(divName) });

  icon = document.createElement("i");
  icon.className = "fas fa-times";
  removeButton.appendChild(icon);

  titleDiv.appendChild(removeButton);

  // Add unordered list to store the links
  favList = document.createElement("ul");
  favList.className = "fav-list";
  favList.id = divName;

  //Add title and list to container
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

function newURL(linkName, linkURL, divName) {
  // Check to see if the local storage item has been pre-created

  // Retrieve the item from local storage
  var categoriesJSON = JSON.parse(window.localStorage.getItem("categories"));
  // Checks to see if the URL is a valid
  if (validateURL(linkURL) === true) {
    // creates a new ID taking the contents length and adding 1
    var linkID = categoriesJSON[divName]["contents"].length + 1;
    // new object to add to contents containing all information for a new link
    const newcontent = {
      name: linkName,
      url: linkURL,
      id: linkID,
    }
    // Adds the new contents to the existing info
    categoriesJSON[divName]["contents"].push(newcontent);
    // Stores information to local storage
    localStorage.setItem("categories", JSON.stringify(categoriesJSON));

    appendSite(linkURL, linkName, linkID, divName);
  }
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
        newURL(linkName.value, linkURL.value, category.value);
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
  var categoriesJSON = JSON.parse(window.localStorage.getItem("categories"));
  for (var i in categoriesJSON[category]["contents"]) {
    // Check to see if the name, url and ID all match the given Object
    if (url == categoriesJSON[category]["contents"][i]["url"] &&
      name == categoriesJSON[category]["contents"][i]["name"] &&
      id == categoriesJSON[category]["contents"][i]["id"]) {
      // Remove item from list
      categoriesJSON[category]["contents"].splice(i, 1);
      // Restore the the information in local storage
      window.localStorage.setItem("categories", JSON.stringify(categoriesJSON));
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
