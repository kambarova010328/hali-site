// Simple localStorage cart shared across all pages.
// Cart shape: { "<productId>": qty, ... }

const CART_KEY = 'hali_cart_v1';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
  updateCartBadges();
}

function addToCart(id, qty) {
  qty = qty || 1;
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  showToast('Товар добавлен в корзину');
}

function setCartQty(id, qty) {
  const cart = getCart();
  qty = parseInt(qty, 10);
  if (!qty || qty < 1) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}

function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function formatPrice(n) {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₸';
}

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2200);
}

document.addEventListener('DOMContentLoaded', updateCartBadges);
