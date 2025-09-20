let cart = JSON.parse(localStorage.getItem("cart")) || {};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const total = Object.values(cart).reduce((sum, item) => sum + item.amount, 0);
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

  let comics = Object.entries(cart)
    .map(
      ([id, item]) => `
      <div class="cartItem" data-id="${id}">
        <img src='../imges/img-${id}.webp'/>
        <div class='content'>
          <div class='description'>
            <h2>${item.name}</h2>
            <p class="cartAuthor">${item.author}</p>
          </div>
          <div class="cartControls">
            <button class="cartDecrease">-</button>
            <span>${item.amount}</span>
            <button class="cartIncrease">+</button>
          </div>
          <p class="total">$${(item.price * item.amount).toFixed(2)}</p>
          <button class='cross'>×</button>
        </div>
      </div>
    `
    )
    .join("");

  let total = `
    <div class='cartTotal'
      <p>Total: $${Object.values(cart).reduce((sum, item) => sum + item.price * item.amount, 0).toFixed(2)}</p>
      <button class='orderButton'>Place an order</button>
    </div>
  `;

  cartBlock.innerHTML = comics + total;

  document.querySelector(".orderButton").addEventListener("click", () => {
    document.querySelector(".form").style.display = "block";
    document.querySelector(".formMessage").style.display = "none";
  });

  document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".formMessage").style.display = "block";
    document.querySelector(".form").style.display = "none";
  });

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

    cartItem.querySelector(".cross").addEventListener("click", () => {
      delete cart[id];
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
    const price = Number(cardDiv.dataset.price.replace(/[^0-9.]/g, ""));

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