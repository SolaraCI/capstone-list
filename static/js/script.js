document.addEventListener("DOMContentLoaded", function () {
  var itemForm = document.getElementById("itemForm");
  var itemContainer = document.getElementById("item-container");

  // Add event listener to the item form to allow creation of new items
  itemForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(itemForm);
    fetch("{% url 'single_list_view' list_id=parent_list.id %}", {
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
          newItem.classList.add("item col-md-4");
          newItem.innerHTML = `
        <div class="card mb-4">
          <div class="card-body">
            <a href="#" class="post-link">
              <h2 class="card-title">${data.item_name}</h2>
            </a>
          </div>
        </div>
      `;
          itemContainer.appendChild(newItem);
          itemForm.reset();
        } else {
          alert("Error creating item");
        }
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
