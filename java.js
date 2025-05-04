function addToCart(product, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produsul a fost adăugat în coș!");
  renderCart();
}

function addToCartWithQuantity(productId, productName, productPrice) {
  let quantity = parseInt(document.getElementById('cantitate').value);  // Preia cantitatea introdusă
  if (quantity < 1) {
    alert("Cantitatea trebuie să fie cel puțin 1!");
    return;
  }

  let product = {
    id: productId,
    name: productName,
    price: productPrice
  };

  addToCart(product, quantity); // Adaugă produsul cu cantitatea selectată în coș
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity--;
    } else {
      cart.splice(productIndex, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartContainer = document.getElementById("cart-items");
  let totalContainer = document.getElementById("cart-total");

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach(product => {
    let item = document.createElement("li");
    item.classList.add("cart-item");
    item.innerHTML = `${product.name} x${product.quantity} - ${product.price * product.quantity} EUR 
    <button onclick="removeFromCart('${product.id}')">➖</button>
    <button onclick="addToCartById('${product.id}', 1)">➕</button>`;
    cartContainer.appendChild(item);
    total += product.price * product.quantity;
  });

  totalContainer.textContent = `Total: ${total} EUR`;

  if (cart.length > 0) {
    document.getElementById("pay-button").style.display = "block";
  } else {
    document.getElementById("pay-button").style.display = "none";
  }
}

function addToCartById(productId, quantity = 1) {
  let productName = "Pizza Verace Mozzarella Di Bufala";  // Numele produsului
  let productPrice = 22;  // Prețul produsului

  let quantityFromInput = parseInt(document.getElementById('cantitate').value);  // Preia cantitatea introdusă

  addToCartWithQuantity(productId, productName, productPrice, quantityFromInput);
}

function showPaymentMethods() {
  let paymentMethodsContainer = document.getElementById("payment-methods");
  paymentMethodsContainer.style.display = "block";
  renderPaypal(parseFloat(document.getElementById("cart-total").textContent.replace("Total: ", "").replace(" EUR", "")));
}

function renderPaypal(price) {
  let paypalContainer = document.getElementById("paypal-button-container");

  if (price === 0 || paypalContainer.innerHTML.includes('Mulțumim')) {
    return;
  }

  if (!paypalContainer.innerHTML) {
    paypal
      .Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "paypal",
        },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{ amount: { currency_code: "EUR", value: price } }], // Prețul total
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (orderData) {
            localStorage.setItem("cart", JSON.stringify([]));
            renderCart();
            paypalContainer.innerHTML = "<h3>Mulțumim că ați cheltuit banii la noi, vă mai așteptăm!</h3>";
          });
        },
        onError: function (err) {
          console.log(err);
        },
      })
      .render("#paypal-button-container");
  }
}

renderCart();
