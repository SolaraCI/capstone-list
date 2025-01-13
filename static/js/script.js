document.addEventListener("DOMContentLoaded", function () {

// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                    Create a new item                                                      \\
// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                                                                                           \\
    var itemForm = document.getElementById("itemForm");
    var itemContainer = document.getElementById("item-container");
  
    // Add event listener to the item form to allow creation of new items
    itemForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      var formData = new FormData(itemForm);
      var listId = itemForm.dataset.listId; // Get the list ID from the form's data attribute
      fetch(`/lists/${listId}/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            var newItem = document.createElement("div");
            newItem.classList.add("row");
            newItem.innerHTML = `
                <div class="col-md-6">
                  <h3 class="card-title item-name">${data.item_name}</h3>
                </div>
                <div class="col-md-3">
                  <button type="button" class="btn btn-secondary mt-2" id="status_0_item_${data.item_id}">Not Started</button>
                  <button type="button" class="btn btn-secondary mt-2" id="status_1_item_${data.item_id}">In Progress</button>
                  <button type="button" class="btn btn-secondary mt-2" id="status_2_item_${data.item_id}">Complete</button>
                </div>
                <div class="col-md-3">
                  <form class="edit_delete_form" method="" action="">
                    <button type="button" class="btn btn-info mt-2" id="edit_item_${data.item_id}">Edit</button>
                    <button type="button" class="btn btn-danger mt-2" id="delete_item_${data.item_id}">Delete</button>
                  </form>
                </div>
            `;
            itemContainer.appendChild(newItem);
            itemForm.reset();
          } else {
            alert("Error creating item");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
//                                                                                                                           \\
// ------------------------------------------------------------------------------------------------------------------------- \\
//                                                     /create a new item                                                    \\
// ========================================================================================================================= \\
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| \\





// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                       Edit an item                                                        \\
// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                                                                                           \\
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
//                                                                                                                           \\
// ------------------------------------------------------------------------------------------------------------------------- \\
//                                                      /edit an item                                                        \\
// ========================================================================================================================= \\
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| \\





// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                  Change an item's status                                                  \\
// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                                                                                           \\
    // Select all status buttons for each status
    var status0Buttons = document.querySelectorAll("[id^='status_0_item_']");
    var status1Buttons = document.querySelectorAll("[id^='status_1_item_']");
    var status2Buttons = document.querySelectorAll("[id^='status_2_item_']");

    // Add event listeners to the status buttons
    status0Buttons.forEach(function (button) {
    button.addEventListener("click", setStatus0);
    });
    status1Buttons.forEach(function (button) {
    button.addEventListener("click", setStatus1);
    });
    status2Buttons.forEach(function (button) {
    button.addEventListener("click", setStatus2);
    });

    // Define the setStatus0 Item function
    function setStatus0(event) {
    var button = event.target;
    var itemId = button.id.split("_")[3];
    var linkedStatus1Button = document.querySelector("#status_1_item_" + itemId);
    var linkedStatus2Button = document.querySelector("#status_2_item_" + itemId);
    var newItemStatus = 0;
    var data = {
        status: newItemStatus,
    };

    // Make an AJAX request to update the item
    fetch(`/items/status0/${itemId}/`, {
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
            button.classList.add("btn-success");
            linkedStatus1Button.classList.remove("btn-success");
            linkedStatus2Button.classList.remove("btn-success");
        } else {
            alert("Error updating item");
        }
        });
    }

    function setStatus1(event) {
    var button = event.target;
    var itemId = button.id.split("_")[3];
    var linkedStatus0Button = document.querySelector("#status_0_item_" + itemId);
    var linkedStatus2Button = document.querySelector("#status_2_item_" + itemId);
    var newItemStatus = 1;
    var data = {
        status: newItemStatus,
    };

    // Make an AJAX request to update the item
    fetch(`/items/status1/${itemId}/`, {
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
            button.classList.add("btn-success");
            linkedStatus0Button.classList.remove("btn-success");
            linkedStatus2Button.classList.remove("btn-success");
        } else {
            alert("Error updating item");
        }
        });
    }

    function setStatus2(event) {
    var button = event.target;
    var itemId = button.id.split("_")[3];
    var linkedStatus0Button = document.querySelector("#status_0_item_" + itemId);
    var linkedStatus1Button = document.querySelector("#status_1_item_" + itemId);
    var newItemStatus = 2;
    var data = {
        status: newItemStatus,
    };

    // Make an AJAX request to update the item
    fetch(`/items/status2/${itemId}/`, {
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
            button.classList.add("btn-success");
            linkedStatus0Button.classList.remove("btn-success");
            linkedStatus1Button.classList.remove("btn-success");
        } else {
            alert("Error updating item");
        }
        });
    }
//                                                                                                                           \\
// ------------------------------------------------------------------------------------------------------------------------- \\
//                                                 /change an item's status                                                  \\
// ========================================================================================================================= \\
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| \\





// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                     Delete an item                                                        \\
// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                                                                                           \\
    // Add event listeners to the delete buttons
    var deleteButtons = document.querySelectorAll("[id^='delete_item_']");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", deleteItem);
    });
  
    // Define the deleteItem function
    function deleteItem(event) {
      var button = event.target;
      var itemId = button.id.split("_")[2];
      
      // Make an AJAX request to delete the item
      fetch(`/items/delete/${itemId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Remove the item from the DOM
            var itemRow = button.closest(".row");
            itemRow.remove();
          } else {
            alert("Error deleting item");
          }
        });
    }
//                                                                                                                           \\
// ------------------------------------------------------------------------------------------------------------------------- \\
//                                                    /delete an item                                                        \\
// ========================================================================================================================= \\
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| \\





// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                         Get cookie                                                        \\
// ========================================================================================================================= \\
// ========================================================================================================================= \\
//                                                                                                                           \\
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
//                                                                                                                           \\
// ------------------------------------------------------------------------------------------------------------------------- \\
//                                                        /get cookie                                                        \\
// ========================================================================================================================= \\
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| \\
