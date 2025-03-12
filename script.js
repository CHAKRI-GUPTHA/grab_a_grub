document.addEventListener("DOMContentLoaded", function () {
  // Authentication & User Details
  const signupSection = document.getElementById("signup-section");
  const loginSection = document.getElementById("login-section");
  const authSection = document.getElementById("auth-section");
  const detailsSection = document.getElementById("details-section");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const detailsForm = document.getElementById("detailsForm");
  const showLoginLink = document.getElementById("show-login");
  const showSignupLink = document.getElementById("show-signup");

  // Toggle between login and signup
  if (showLoginLink) showLoginLink.addEventListener("click", () => toggleAuth("login"));
  if (showSignupLink) showSignupLink.addEventListener("click", () => toggleAuth("signup"));

  function toggleAuth(type) {
    signupSection.style.display = type === "signup" ? "block" : "none";
    loginSection.style.display = type === "login" ? "block" : "none";
  }

  // Signup Form Submission
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const newUsername = document.getElementById("newUsername").value;
      const newPassword = document.getElementById("newPassword").value;

      if (newUsername && newPassword) {
        localStorage.setItem("username", newUsername);
        localStorage.setItem("password", newPassword);
        alert("Sign-up successful! Please log in.");
        toggleAuth("login");
      }
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (username === localStorage.getItem("username") && password === localStorage.getItem("password")) {
        alert("Login successful!");
        authSection.style.display = "none";
        detailsSection.style.display = "block";
      } else {
        alert("Invalid username or password.");
      }
    });
  }

  // Details Form Submission
  if (detailsForm) {
    detailsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      localStorage.setItem("fullName", document.getElementById("fullName").value);
      localStorage.setItem("phoneNumber", document.getElementById("phoneNumber").value);
      localStorage.setItem("addressDetail", document.getElementById("addressDetail").value);
      localStorage.setItem("district", document.getElementById("district").value);
      alert("Details confirmed!");
      window.location.href = "menu.html";
    });
  }

  // Menu & Order Processing
  const menuTableBody = document.getElementById("menuTableBody");
  const selectedItemsBody = document.getElementById("selectedItemsBody");
  const totalItemsSpan = document.getElementById("totalItems");
  const totalCostSpan = document.getElementById("totalCost");
  let selectedItems = {};
  let totalItems = 0;
  let totalCost = 0;

  const menuItems = ["Margherita Pizza", "Pepperoni Pizza", "BBQ Chicken Pizza", "Veggie Supreme Pizza", "Paneer Tikka Pizza"];

  function generateMenu() {
    menuItems.forEach((item, index) => {
      const tr = document.createElement("tr");
      const price = Math.floor(Math.random() * 900) + 100;
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item}</td>
        <td>₹${price}</td>
        <td><button onclick="selectItem('${item}', ${price})">Select</button></td>
      `;
      menuTableBody.appendChild(tr);
    });
  }

  window.selectItem = function (item, price) {
    if (selectedItems[item]) {
      selectedItems[item].quantity += 1;
    } else {
      selectedItems[item] = { price, quantity: 1 };
    }
    totalItems += 1;
    totalCost += price;
    updateSelectedItems();
  };

  function updateSelectedItems() {
    selectedItemsBody.innerHTML = "";
    for (const item in selectedItems) {
      let tr = document.createElement("tr");
      tr.innerHTML = `<td>${item}</td><td>₹${selectedItems[item].price}</td><td>${selectedItems[item].quantity}</td>`;
      selectedItemsBody.appendChild(tr);
    }
    totalItemsSpan.textContent = totalItems;
    totalCostSpan.textContent = totalCost;
  }

  window.redirectToConfirm = function () {
    localStorage.setItem("totalCost", totalCost);
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    window.location.href = "confirm_order.html";
  };

  // Order Confirmation & Payment Handling
  document.getElementById("payment").addEventListener("change", function () {
    const paymentMethod = this.value;
    document.getElementById("debitDetails").style.display = paymentMethod === "debit" ? "block" : "none";
    document.getElementById("phonePeQR").style.display = paymentMethod === "phonepe" ? "block" : "none";
  });

  window.confirmOrder = function () {
    const address = document.getElementById("address").value;
    const paymentMethod = document.getElementById("payment").value;

    if (!address || !paymentMethod) {
      alert("Please enter your address and select a payment method.");
      return;
    }

    if (paymentMethod === "debit") {
      const cardNumber = document.getElementById("cardNumber").value;
      const expiry = document.getElementById("expiry").value;
      const cvv = document.getElementById("cvv").value;
      if (!cardNumber || !expiry || !cvv || cardNumber.length !== 16 || cvv.length !== 3) {
        alert("Please enter valid debit card details.");
        return;
      }
    }

    document.getElementById("orderStatus").style.display = "block";
    setTimeout(() => {
      document.getElementById("orderStatus").textContent = "Your order is confirmed!";
      document.querySelector(".checkmark").style.display = "block";
      document.getElementById("nextOptions").style.display = "block";
    }, 3000);
  };

  generateMenu();
});
