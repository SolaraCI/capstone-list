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
});
