let createItemButton = document.getElementById("create-item-button");
let itemContainer = document.getElementById("item-container");
let newItemInput = document.getElementById("new-item-input");


createItemButton.addEventListener("click", function () {
    let inputForm = document.createElement("input");
    inputForm.type = "text";
    inputForm.placeholder = "Enter new item name";
    inputForm.classList.add("form-control", "mt-3");
    itemContainer.appendChild(inputForm);
  });
