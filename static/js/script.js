document.addEventListener("DOMContentLoaded", function () {
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
              <button type="button">Not Started</button>
              <button type="button">In Progress</button>
              <button type="button">Complete</button>
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
        console.error('There was a problem with the fetch operation:', error);
      });
  });
});

// var createItemButton = document.getElementById("create-item-button");
// var itemContainer = document.getElementById("item-container");
// var formActive = false;

// // Function to submit the item
// function submitItem() {
//   let inputForm = document.querySelector("input");
//   let itemName = inputForm.value;
//   let item = document.createElement("div");
//   item.classList.add("item");
//   item.innerHTML = itemName;
//   itemContainer.appendChild(item);
//   itemContainer.removeChild(inputForm);
//   formActive = false;
// }

// // Add event listener to the create item button
// createItemButton.addEventListener("click", function () {
//   // If the form is not active, create a form
//   if (formActive == false) {
//     let inputForm = document.createElement("input");
//     inputForm.type = "text";
//     inputForm.placeholder = "Enter new item name";
//     inputForm.formMethod = "post";
//     inputForm.formAction = "submit";
//     inputForm.classList.add("form-control", "mt-3");
//     itemContainer.appendChild(inputForm);
//     formActive = true;
//     // Add event listener to the input form
//     inputForm.addEventListener("keypress", function (e) {
//       if (e.key === "Enter" && inputForm.value != "") {
//         submitItem();
//       }
//     });
//   }
//   // If the form is active, remove the form and create a new item
//   else if (formActive == true && inputForm.value != "") {
//     submitItem();
//   }
// });
// });
