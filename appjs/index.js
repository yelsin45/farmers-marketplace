document.addEventListener("DOMContentLoaded", function () {
  let data = {
    products: [],
    users: JSON.parse(localStorage.getItem("users")) || [],
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

      const pricingSection = document.getElementById("pricing-data");
      pricingSection.innerHTML = ""; 
      for (const [product, price] of Object.entries(data.pricing)) {
        const p = document.createElement("p");
        p.textContent = `${product}: ${price}`;
        pricingSection.appendChild(p);
      }

      window.filterCategory = function (category) {
        const itemsSection = document.getElementById("items");
        itemsSection.innerHTML = "";
        data.products.forEach((product) => {
          if (product.category === category) {
            renderProduct(product);
          }
        });
      };

      window.searchProducts = function () {
        const searchTerm = document
          .getElementById("searchInput")
          .value.toLowerCase();
        const itemsSection = document.getElementById("items");
        itemsSection.innerHTML = ""; 
        data.products.forEach((product) => {
          if (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
          ) {
            renderProduct(product);
          }
        });
      };

        document.getElementById("postProductForm")
        document.addEventListener("submit", (event) => {
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

        document.getElementById("orderForm")
        document.addEventListener("submit", (event) => {
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
      
          alert("Order placed successfully!");
          document.getElementById("orderForm").reset();
          closeOrderModal();
        });
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
      data.products.forEach((product) => renderProduct(product));
    });

    document.getElementById("farmer-profile")
    document.querySelector("button")
    document.addEventListener("click", () => {
      openRegistrationModal("farmer");
    });
    document.getElementById("buyer-profile")
    document.querySelector("button")
    document.addEventListener("click", () => {
      openRegistrationModal("buyer");
    });

    document.getElementById("admin-profile")
    document.querySelector("button")
    document.addEventListener("click", () => {
      openLoginModal();
    });

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = data.users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful!");
      closeLoginModal();
      document.getElementById("user-name").textContent = user.name;
      document.getElementById("user-email").textContent = user.email;
      document.getElementById("user-phone").textContent = user.phone;
      document.getElementById("user-details").style.display = "block";
    } else {
      alert("Invalid username or password.");
    }
  });
    document.getElementById("registrationForm")
    document.addEventListener("submit", (event) => {
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
        username: email, 
      };

    });
});
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
function openRegistrationOptions() {
  document.getElementById("registrationOptionsModal").style.display = "block";
}
function closeRegistrationOptionsModal() {
  document.getElementById("registrationOptionsModal").style.display = "none";
}

