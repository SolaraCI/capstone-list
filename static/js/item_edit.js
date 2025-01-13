document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to the edit buttons
  var editButtons = document.querySelectorAll("[id^='edit_item_']");
  editButtons.forEach(function (button) {
    button.addEventListener("click", editItem);
  });

  // Define the editItem function
  function editItem(event) {
    var button = event.target;
    var itemId = button.id.split("_")[2];
    var itemNameElement = this.closest(".row").querySelector(".item-name");
    var itemName = itemNameElement.textContent;

    // Create an input field to edit the item
    var editForm = document.createElement("input");
    editForm.type = "text";
    editForm.value = itemName;
    editForm.classList.add("form-control");

    // Replace current item name with input contents
    itemNameElement.replaceWith(editForm);

    // Change the edit button to a save button
    button.textContent = "Save";
    button.classList.remove("btn-info");
    button.classList.add("btn-success");
    button.id = "save_item_" + itemId;

    // Remove the edit event listener and add the save event listener
    button.removeEventListener("click", editItem);
    button.addEventListener("click", saveItem);
  }

  // Define the save function
  function saveItem(event) {
    var button = event.target;
    var itemId = button.id.split("_")[2];
    var editField = button.closest(".row").querySelector(".form-control");
    var newItemName = editField.value.trim();
    var data = {
      item_name: newItemName,
    };

    // Make an AJAX request to update the item
    fetch(`/items/edit/${itemId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Replace the input field with the updated item name
          var updatedItemName = document.createElement("h3");
          updatedItemName.classList.add("card-title", "item-name");
          updatedItemName.textContent = newItemName;
          editField.replaceWith(updatedItemName);
          button.textContent = "Edit";
          button.classList.remove("btn-success");
          button.classList.add("btn-info");
          button.id = "edit_item_" + itemId;

          // Remove the save event listener and add the edit event listener back
          button.removeEventListener("click", saveItem);
          button.addEventListener("click", editItem);
        } else {
          alert("Error updating item");
        }
      });
  }

  // Function to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});

