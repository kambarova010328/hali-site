const CATEGORY_NAMES = {
  moyki: 'Мойки',
  smesiteli: 'Смесители',
  dushevye: 'Душевые наборы',
  installyacii: 'Инсталляции и унитазы',
  rakoviny: 'Раковины',
  aksessuary: 'Аксессуары'
};

function pdBuildCard(id, p) {
  const img = (p.images && p.images[0]) || '';
  const outOfStock = getStock(id) === 'out_of_stock';
  const btnAttrs = outOfStock ? ' disabled' : '';
  const btnText = outOfStock ? 'Нет в наличии' : 'В корзину';
  const discountTag = (p.discount && p.oldPrice) ? '<span class="thumb-discount-tag">-' + p.discount + '%</span>' : '';
  const priceHTML = (p.discount && p.oldPrice)
    ? '<span class="price-tag has-discount"><span class="price-old-row"><span class="price-old">' + formatPrice(p.oldPrice) + '</span><span class="discount-badge-sm">-' + p.discount + '%</span></span>' + formatPrice(p.price) + '<small>' + formatPrice(p.installmentPrice) + ' × ' + p.installmentMonths + ' мес</small></span>'
    : '<span class="price-tag">' + formatPrice(p.price) + '<small>' + formatPrice(p.installmentPrice) + ' × ' + p.installmentMonths + ' мес</small></span>';
  return (
    '<div class="product-card" data-id="' + id + '">' +
      '<a href="product.html?id=' + id + '" class="product-thumb-link">' + discountTag + '<div class="product-thumb"><img src="' + img + '" alt="' + p.name + '" loading="lazy"></div></a>' +
      '<div class="product-body">' +
        '<a href="product.html?id=' + id + '" class="product-title-link"><h3>' + p.name + '</h3></a>' +
        '<div class="product-foot">' + priceHTML + stockBadgeHTML(id) + '</div>' +
        '<div class="product-actions">' +
          '<button class="btn-add-cart"' + btnAttrs + ' onclick="addToCart(\'' + id + '\',1)">' + btnText + '</button>' +
          '<a href="' + p.kaspiUrl + '" target="_blank" rel="noopener" class="mini-btn" title="Купить на Kaspi.kz"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const products = window.PRODUCTS || {};
  const product = id ? products[id] : null;

  if (!product) {
    document.getElementById('pd-not-found').style.display = 'block';
    return;
  }

  document.getElementById('pd-content').style.display = 'block';
  document.title = product.name + ' — HALI';

  const catName = CATEGORY_NAMES[product.category] || 'Каталог';
  document.getElementById('pd-breadcrumbs').innerHTML =
    '<a href="index.html" style="color:inherit">Главная</a> / ' +
    '<a href="catalog.html#' + product.category + '" style="color:inherit">' + catName + '</a> / ' + product.name;

  document.getElementById('pd-category').textContent = catName;
  document.getElementById('pd-name').textContent = product.name;

  const status = getStock(id);
  document.getElementById('pd-stock').innerHTML = stockBadgeHTML(id, 'pd-stock');

  document.getElementById('pd-price').textContent = formatPrice(product.price);
  document.getElementById('pd-installment').textContent = product.installmentMonths
    ? 'В рассрочку: ' + formatPrice(product.installmentPrice) + ' × ' + product.installmentMonths + ' мес'
    : '';

  if (product.discount && product.oldPrice) {
    document.getElementById('pd-price').classList.add('pd-price-discounted');
    document.getElementById('pd-old-price').textContent = formatPrice(product.oldPrice);
    document.getElementById('pd-discount-row').style.display = 'flex';
  }

  const images = (product.images && product.images.length) ? product.images : ['assets/logo.png'];
  const mainImg = document.getElementById('pd-main-image');
  mainImg.src = images[0];
  mainImg.alt = product.name;

  const thumbsWrap = document.getElementById('pd-thumbs');
  images.forEach(function (src, i) {
    const t = document.createElement('img');
    t.src = src;
    t.alt = product.name + ' фото ' + (i + 1);
    if (i === 0) t.classList.add('active');
    t.addEventListener('click', function () {
      mainImg.src = src;
      thumbsWrap.querySelectorAll('img').forEach(function (el) { el.classList.remove('active'); });
      t.classList.add('active');
    });
    thumbsWrap.appendChild(t);
  });
  if (images.length < 2) thumbsWrap.style.display = 'none';

  document.getElementById('pd-kaspi-link').href = product.kaspiUrl;

  document.getElementById('pd-description').textContent = product.description || 'Описание уточняйте у менеджера.';

  const specsWrap = document.getElementById('pd-specs');
  if (product.specs && product.specs.length) {
    product.specs.forEach(function (pair) {
      const dl = document.createElement('dl');
      dl.innerHTML = '<dt>' + pair[0] + '</dt><dd>' + pair[1] + '</dd>';
      specsWrap.appendChild(dl);
    });
  } else {
    specsWrap.innerHTML = '<p style="color:var(--text-muted)">Характеристики уточняйте у менеджера.</p>';
  }

  // Tabs
  document.querySelectorAll('.pd-tab-nav button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pd-tab-nav button').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.pd-tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('pd-tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Quantity stepper
  const qtyInput = document.getElementById('pd-qty');
  document.getElementById('pd-qty-minus').addEventListener('click', function () {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  document.getElementById('pd-qty-plus').addEventListener('click', function () {
    qtyInput.value = parseInt(qtyInput.value, 10) + 1;
  });

  const addBtn = document.getElementById('pd-add-cart');
  if (status === 'out_of_stock') {
    addBtn.disabled = true;
    addBtn.textContent = 'Нет в наличии';
    qtyInput.disabled = true;
    document.getElementById('pd-qty-minus').disabled = true;
    document.getElementById('pd-qty-plus').disabled = true;
  } else {
    addBtn.addEventListener('click', function () {
      const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      addToCart(id, qty);
    });
  }

  // Related products (same category, excluding current)
  const relatedWrap = document.getElementById('pd-related');
  const relatedSection = document.getElementById('pd-related-wrap');
  const related = Object.keys(products)
    .filter(function (pid) { return pid !== id && products[pid].category === product.category; })
    .slice(0, 4);
  if (related.length) {
    relatedSection.style.display = 'block';
    related.forEach(function (pid) {
      relatedWrap.insertAdjacentHTML('beforeend', pdBuildCard(pid, products[pid]));
    });
  }
});
