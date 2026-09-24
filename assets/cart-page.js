function renderCartPage() {
  const cart = getCart();
  const products = window.PRODUCTS || {};
  const ids = Object.keys(cart).filter(function (id) { return products[id]; });

  const emptyEl = document.getElementById('cart-empty');
  const layoutEl = document.getElementById('cart-layout');

  if (!ids.length) {
    emptyEl.style.display = 'block';
    layoutEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  layoutEl.style.display = 'grid';

  const itemsWrap = document.getElementById('cart-items');
  itemsWrap.innerHTML = '';
  let total = 0;
  let totalCount = 0;

  ids.forEach(function (id) {
    const p = products[id];
    const qty = cart[id];
    const lineTotal = p.price * qty;
    total += lineTotal;
    totalCount += qty;
    const img = (p.images && p.images[0]) || 'assets/logo.png';

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML =
      '<div class="cart-item-thumb"><img src="' + img + '" alt="' + p.name + '"></div>' +
      '<div class="cart-item-info">' +
        '<a href="product.html?id=' + id + '"><h3>' + p.name + '</h3></a>' +
        (typeof stockBadgeHTML === 'function' ? stockBadgeHTML(id) : '') +
        '<div class="qty-stepper" style="margin-top:8px">' +
          '<button type="button" class="cart-qty-minus">−</button>' +
          '<input type="number" min="1" value="' + qty + '" class="cart-qty-input">' +
          '<button type="button" class="cart-qty-plus">+</button>' +
        '</div>' +
        '<a href="#" class="cart-item-remove">Удалить</a>' +
      '</div>' +
      '<div class="cart-item-price">' + formatPrice(lineTotal) + '</div>';

    el.querySelector('.cart-qty-minus').addEventListener('click', function () {
      const input = el.querySelector('.cart-qty-input');
      input.value = Math.max(1, parseInt(input.value, 10) - 1);
      setCartQty(id, input.value);
      renderCartPage();
    });
    el.querySelector('.cart-qty-plus').addEventListener('click', function () {
      const input = el.querySelector('.cart-qty-input');
      input.value = parseInt(input.value, 10) + 1;
      setCartQty(id, input.value);
      renderCartPage();
    });
    el.querySelector('.cart-qty-input').addEventListener('change', function (e) {
      setCartQty(id, e.target.value);
      renderCartPage();
    });
    el.querySelector('.cart-item-remove').addEventListener('click', function (e) {
      e.preventDefault();
      removeFromCart(id);
      renderCartPage();
    });

    itemsWrap.appendChild(el);
  });

  document.getElementById('cart-count-label').textContent = totalCount;
  document.getElementById('cart-total').textContent = formatPrice(total);

  const hasOutOfStock = typeof getStock === 'function' && ids.some(function (id) { return getStock(id) === 'out_of_stock'; });
  const warnEl = document.getElementById('cart-stock-warning');
  if (warnEl) warnEl.style.display = hasOutOfStock ? 'block' : 'none';
}

function buildOrderMessage() {
  const cart = getCart();
  const products = window.PRODUCTS || {};
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();

  let lines = ['Здравствуйте! Хочу оформить заказ на сайте HALI:', ''];
  let total = 0;
  Object.keys(cart).forEach(function (id) {
    const p = products[id];
    if (!p) return;
    const qty = cart[id];
    const lineTotal = p.price * qty;
    total += lineTotal;
    lines.push('• ' + p.name + ' — ' + qty + ' шт. × ' + formatPrice(p.price) + ' = ' + formatPrice(lineTotal));
  });
  lines.push('');
  lines.push('Итого: ' + formatPrice(total));
  if (name) lines.push('Имя: ' + name);
  if (phone) lines.push('Телефон: ' + phone);

  return lines.join('\n');
}

document.addEventListener('DOMContentLoaded', function () {
  renderCartPage();

  document.getElementById('checkout-whatsapp').addEventListener('click', function () {
    const text = encodeURIComponent(buildOrderMessage());
    window.open('https://wa.me/77479615804?text=' + text, '_blank');
  });

  document.getElementById('checkout-email').addEventListener('click', function () {
    const subject = encodeURIComponent('Заказ с сайта HALI');
    const body = encodeURIComponent(buildOrderMessage());
    window.location.href = 'mailto:dola.group2025@gmail.com?subject=' + subject + '&body=' + body;
  });
});
