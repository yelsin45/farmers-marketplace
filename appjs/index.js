document.addEventListener("DOMContentLoaded", function () {
  let data = {
    products: [],
    users: [],
    pricing: {},
    user: JSON.parse(localStorage.getItem("user")) || {},
  };

  if (data.user.name) {
    document.getElementById("user-name").textContent = data.user.name;
    document.getElementById("user-email").textContent = data.user.email;
    document.getElementById("user-phone").textContent = data.user.phone;
    document.getElementById("user-details").style.display = "block";
    if (data.user.userType === "admin") {
      document.getElementById("pricing-data").classList.add("admin");
    }
  }

  fetch("db.json")
    .then((response) => response.json())
    .then((fetchedData) => {
      data.products = fetchedData.products;
      data.pricing = fetchedData.pricing;

      // Populate real-time pricing
      const pricingSection = document.getElementById("pricing-data");
      pricingSection.innerHTML = ""; 
      for (const [product, price] of Object.entries(data.pricing)) {
        const p = document.createElement("p");
        p.textContent = `${product}: ${price}`;
        pricingSection.appendChild(p);
      }

      // Filter products by category
      window.filterCategory = function (category) {
        const itemsSection = document.getElementById("items");
        itemsSection.innerHTML = ""; 
        data.products.forEach((product) => {
          if (product.category === category) {
            renderProduct(product);
          }
        });
      };

      // Event listener for post product form submission
      document
        .getElementById("postProductForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const productName = document.getElementById("productName").value;
          const category = document.getElementById("category").value;
          const description = document.getElementById("description").value;
          const price = document.getElementById("price").value;
          const image = document.getElementById("image").files[0];
          const location = document.getElementById("location").value;
          const contact = document.getElementById("contact").value;

          const reader = new FileReader();
          reader.onloadend = function () {
            const product = {
              id: data.products.length + 1,
              name: productName,
              category: category,
              description: description,
              price: price,
              location: location,
              contact: contact,
              photos: [reader.result],
            };
            data.products.push(product);
            alert("Product posted successfully!");
            document.getElementById("postProductForm").reset();
            renderProduct(product);
          };
          if (image) {
            reader.readAsDataURL(image);
          }
        });

      // Event listener for order form submission
      document
        .getElementById("orderForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const productId = document.getElementById("productId").value;
          const buyerName = document.getElementById("buyerName").value;
          const buyerEmail = document.getElementById("buyerEmail").value;
          const phone = document.getElementById("phone").value;
          const quantity = document.getElementById("quantity").value;
          const address = document.getElementById("address").value;

          const order = {
            productId: productId,
            buyerName: buyerName,
            buyerEmail: buyerEmail,
            phone: phone,
            quantity: quantity,
            address: address,
          };
          // Simulate order processing
          alert("Order placed successfully!");
          document.getElementById("orderForm").reset();
          closeOrderModal();
        });

      // Show product description
      window.showDescription = function (productId) {
        const product = data.products.find((p) => p.id === productId);
        const descriptionSection = document.getElementById("item-description");
        document.getElementById("description-image").src = product.photos[0];
        const descriptionText = `
                    Name: ${product.name}
                    Category: ${product.category}
                    Description: ${product.description}
                    Price: ${product.price}
                    Location: ${product.location}
                    Contact: ${product.contact}
                `;
        document.getElementById("description-text").textContent =
          descriptionText;
        descriptionSection.style.display = "block";
        initMap(product.location);
      };

      // Delete product
      window.deleteProduct = function (productId) {
        const productIndex = data.products.findIndex((p) => p.id === productId);
        if (productIndex > -1) {
          data.products.splice(productIndex, 1);
          alert("Product deleted successfully!");
          filterCategory(
            document.querySelector(".categories button.active").textContent
          );
        }
      };

      // Initialize Google Map
      window.initMap = function (location) {
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: { lat: -34.397, lng: 150.644 },
        });
        const geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map, location);
      };

      // Geocode address and display on map
      function geocodeAddress(geocoder, resultsMap, address) {
        geocoder.geocode({ address: address }, function (results, status) {
          if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location,
            });
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        });
      }

      function renderProduct(product) {
        const itemsSection = document.getElementById("items");
        const itemDiv = document.createElement("div");
        itemDiv.className = "listing col-md-4";
        itemDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.photos[0]}" alt="${product.name} Image" class="img-fluid">
                    <p>Location: ${product.location}</p>
                    <button class="btn btn-primary" onclick="openOrderModal(${product.id})">Order</button>
                    <button class="btn btn-secondary" onclick="showDescription(${product.id})">Description</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                `;
        itemsSection.appendChild(itemDiv);
      }

      // Initial render of all products
      data.products.forEach((product) => renderProduct(product));
    });

  // Event listeners for profile buttons
  document
    .getElementById("farmer-profile")
    .querySelector("button")
    .addEventListener("click", () => {
      openRegistrationModal("farmer");
    });

  document
    .getElementById("buyer-profile")
    .querySelector("button")
    .addEventListener("click", () => {
      openRegistrationModal("buyer");
    });

  document
    .getElementById("admin-profile")
    .querySelector("button")
    .addEventListener("click", () => {
      openLoginModal();
    });

  // Login form submission
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    alert(`Username: ${username}\nPassword: ${password}`);
    closeLoginModal();
  });

  // Registration form submission
  document
    .getElementById("registrationForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const userType = document.getElementById("userType").value;
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("regPassword").value;

      const user = {
        userType: userType,
        name: name,
        email: email,
        phone: phone,
        password: password,
      };

      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify(user));
      alert("Registration successful!");
      closeRegistrationModal();
    });
});

// Function to show and hide sections
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
}

// Functions to open and close the login modal
function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

// Functions to open and close the registration options modal
function openRegistrationOptions() {
  document.getElementById("registrationOptionsModal").style.display = "block";
}

function closeRegistrationOptionsModal() {
  document.getElementById("registrationOptionsModal").style.display = "none";
}

// Functions to open and close the registration modal
function openRegistrationModal(userType) {
  document.getElementById("userType").value = userType;
  document.getElementById("registrationModal").style.display = "block";
}

function closeRegistrationModal() {
  document.getElementById("registrationModal").style.display = "none";
}

// Functions to open and close the order modal
function openOrderModal(productId) {
  document.getElementById("productId").value = productId;
  document.getElementById("orderModal").style.display = "block";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}
