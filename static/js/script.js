document.addEventListener("DOMContentLoaded", function () {
  var itemForm = document.getElementById("item-form");
  var itemContainer = document.getElementById("item-container");

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
