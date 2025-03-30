function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    console.error("Eroare la parsarea coșului:", e);
    return [];
  }
}

function addToCart(product) {
  let cart = getCart();
  let existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produsul a fost adăugat în coș!");
  renderCart();
}

function removeFromCart(productId) {
  let cart = getCart();
  let productIndex = cart.findIndex(item => item.id.toString() === productId.toString());

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
  let cart = getCart();
  let cartContainer = document.getElementById("cart-items");
  let totalContainer = document.getElementById("cart-total");

  cartContainer.innerHTML = "";
  let totalEUR = 0;

  cart.forEach(product => {
    let priceRON = product.price * 5;
    let item = document.createElement("li");
    item.innerHTML = `${product.name} x${product.quantity} - ${priceRON * product.quantity} RON 
      <button onclick="removeFromCart('${product.id}')">➖</button>`;
    cartContainer.appendChild(item);
    totalEUR += product.price * product.quantity;
  });

  let totalRON = totalEUR * 5;
  totalContainer.textContent = `Total: ${totalRON} RON`;

  if (document.getElementById("paypal-button-container")) {
    renderPaypal(totalEUR);
  }
}

function renderPaypal(priceEUR) {
  let paypalContainer = document.getElementById("paypal-button-container");
  if (!paypalContainer) return;

  if (priceEUR === 0) {
    paypalContainer.innerHTML = "";
    return;
  }

  paypal.Buttons({
    style: {
      shape: "rect",
      color: "gold",
      layout: "vertical",
      label: "paypal",
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{ amount: { currency_code: "EUR", value: priceEUR } }],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        localStorage.setItem("cart", JSON.stringify([]));
        renderCart();
        paypalContainer.innerHTML = "<h3>Multumim ca ati cheltuit banii la noi,va mai asteptam!!</h3>";
      });
    },
    onError: function (err) {
      console.error("Eroare la procesarea plății:", err);
    },
  }).render("#paypal-button-container");
}

renderCart();
