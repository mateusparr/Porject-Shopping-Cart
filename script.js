const baseUrl = 'https://api.mercadolibre.com/sites/MLB/';
const cartList = document.querySelector('.cart__items');
const emptyCartButton = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// LOCALSTORAGE FUNCTIONS

function saveCartToLocalStorage(itemToSave) {
  localStorage.setItem('cart-Item', itemToSave);
}

const getCartSavedOnLocal = async () => {
  const savedItems = localStorage.getItem('cart-Item');
  cartList.innerHTML = savedItems;
};

function saveTotalPrices() {
  const totalPrice = document.querySelector('.total-price');
  const getItems = document.querySelectorAll('.cart__item'); // retorna nodelist
  let soma = 0;
  getItems.forEach((item) => {
    const itemText = item.innerText;
    const priceString = itemText.split('$')[1];
    soma += parseFloat(priceString);
  });
  totalPrice.innerText = soma;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveTotalPrices();
  localStorage.removeItem(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductInfo(itemId) {
  const prod = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const prodObj = prod.json();
  return prodObj; 
}

async function addItemToCart(itemId) {
  const object = await getProductInfo(itemId);
  cartList.appendChild(createCartItemElement(object));
  saveCartToLocalStorage(cartList.innerHTML);
  saveTotalPrices();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCreate = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCreate.addEventListener('click', (event) => {
    addItemToCart(getSkuFromProductItem(event.target.parentNode));
    saveCartToLocalStorage(event.target.textContent);
  });
  section.appendChild(buttonCreate);
  return section;
}

// REQUISITO 1

async function getProducts() {
  const response = await fetch(`${baseUrl}search?q=$computer`);
  const product = response.json();
  const loading = document.querySelector('.loading');
  loading.remove();
  return product;
}

function clearCart() {
  cartList.innerText = '';
  saveTotalPrices();
}

emptyCartButton.addEventListener('click', clearCart);

window.onload = async () => {
  const product = await getProducts();
  product.results.forEach((value) => {
    const element = createProductItemElement(value);
    const items = document.querySelector('.items');
    items.appendChild(element);
  });
  getCartSavedOnLocal();
};
