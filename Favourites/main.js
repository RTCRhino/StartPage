function favHide(e) {
  var category = e.target.nextElementSibling;
  if (category.className.indexOf("fav-hide") == -1) {
    category.className += " fav-hide";
  } else { 
    category.className = category.className.replace(" fav-hide", "");
  }
}