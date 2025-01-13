document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners to the edit buttons
    var deleteButtons = document.querySelectorAll("[id^='delete_item_']");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", deleteItem);
    });
  
    // Define the editItem function
    function deleteItem(event) {
      var button = event.target;
      var itemId = button.id.split("_")[2];
      
      // Make an AJAX request to update the item
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
  