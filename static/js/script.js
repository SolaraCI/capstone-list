document.addEventListener("DOMContentLoaded", function () {
  var createItemButton = document.getElementById("create-item-button");
  var itemContainer = document.getElementById("item-container");
  var formActive = false;

  // Function to submit the item
  function submitItem() {
    let inputForm = document.querySelector("input");
    let itemName = inputForm.value;
    let item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = itemName;
    itemContainer.appendChild(item);
    itemContainer.removeChild(inputForm);
    formActive = false;
  }

  // Add event listener to the create item button
  createItemButton.addEventListener("click", function () {
    // If the form is not active, create a form
    if (formActive == false) {
      let inputForm = document.createElement("input");
      inputForm.type = "text";
      inputForm.placeholder = "Enter new item name";
      inputForm.formMethod = "post";
      inputForm.formAction = "submit";
      inputForm.classList.add("form-control", "mt-3");
      itemContainer.appendChild(inputForm);
      formActive = true;
      // Add event listener to the input form
      inputForm.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && inputForm.value != "") {
          submitItem();
        }
      });
    }
    // If the form is active, remove the form and create a new item
    else if (formActive == true && inputForm.value != "") {
      submitItem();
    }
  });
});
