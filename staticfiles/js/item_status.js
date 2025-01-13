document.addEventListener("DOMContentLoaded", function () {
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
