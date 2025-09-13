let cart = JSON.parse(localStorage.getItem("cart")) || {};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.amount, 0);
}

function getCartSum() {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.amount, 0);
}

function updateCartCount() {
  const total = getCartTotal();
  const countSpan = document.querySelector(".cartCount");

  if (total > 0) {
    countSpan.style.display = "inline";
    countSpan.textContent = `( ${total} )`;
  } else {
    countSpan.style.display = "none";
  }
  renderCartBlock();
}

function renderCartBlock() {
  const cartBlock = document.querySelector(".cartBlock");
  if (!cartBlock) return;

  if (Object.keys(cart).length === 0) {
    cartBlock.innerHTML = "<p class='cartTotal'>Корзина пуста</p>";
    return;
  }

  let itemsHTML = Object.entries(cart)
    .map(
      ([id, item]) => `
      <div class="cartItem" data-id="${id}">
        <img src='../imges/img-${id}.jpg'/>
        <div class='content'>
          <div class='description'>
            <h2>${item.name}</h2>
            <p class="cartAuthor">${item.author}</p>
          </div>
          <p class="total">$${(item.price * item.amount).toFixed(2)}</p>
          <div class="cartControls">
            <button class="cartDecrease">-</button>
            <span>${item.amount}</span>
            <button class="cartIncrease">+</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  let totalHTML = `
    <p class="cartTotal">Итого: $${getCartSum().toFixed(2)}</p>
  `;

  cartBlock.innerHTML = itemsHTML + totalHTML;

  addCartBlockListeners();
}

function addCartBlockListeners() {
  document.querySelectorAll(".cartItem").forEach(cartItem => {
    const id = cartItem.dataset.id;

    cartItem.querySelector(".cartIncrease").addEventListener("click", () => {
      cart[id].amount++;
      saveCart();
      updateCartCount();
    });

    cartItem.querySelector(".cartDecrease").addEventListener("click", () => {
      cart[id].amount--;
      if (cart[id].amount <= 0) {
        delete cart[id];
      }
      saveCart();
      updateCartCount();
    });
  });
}

function updateButton(cardDiv) {
  const id = cardDiv.dataset.id;
  const addToCartButton = cardDiv.querySelector(".addToCart");

  if (cart[id]) {
    addToCartButton.outerHTML = `
      <div class="counter">
        <button class="decrease">-</button>
        <span class="count">${cart[id].amount}</span>
        <button class="increase">+</button>
      </div>
    `;
    addCounterListeners(cardDiv);
  }
}

function addCounterListeners(cardDiv) {
  const id = cardDiv.dataset.id;
  const counter = cardDiv.querySelector(".counter");

  counter.querySelector(".increase").addEventListener("click", () => {
    cart[id].amount++;
    saveCart();
    counter.querySelector(".count").textContent = cart[id].amount;
    updateCartCount();
  });

  counter.querySelector(".decrease").addEventListener("click", () => {
    cart[id].amount--;
    if (cart[id].amount <= 0) {
      delete cart[id];
      cardDiv.querySelector(".counter").outerHTML =
        `<button class="addToCart">Add to cart</button>`;
      addAddToCartListener(cardDiv);
    } else {
      counter.querySelector(".count").textContent = cart[id].amount;
    }
    saveCart();
    updateCartCount();
  });
}

function addAddToCartListener(cardDiv) {
  cardDiv.querySelector(".addToCart").addEventListener("click", () => {
    const id = cardDiv.dataset.id;
    const name = cardDiv.dataset.name;
    const author = cardDiv.dataset.author;
    const price = Number(cardDiv.dataset.price.replace(/[^0-9.]/g, "")); // преобразуем "$2.25" → 2.25

    if (!cart[id]) {
      cart[id] = { name, author, price, amount: 1 };
    }
    saveCart();
    updateButton(cardDiv);
    updateCartCount();
  });
}

document.querySelectorAll(".card").forEach(cardDiv => {
  const id = cardDiv.dataset.id;
  if (cart[id]) {
    updateButton(cardDiv);
  } else {
    addAddToCartListener(cardDiv);
  }
});

updateCartCount();
renderCartBlock();