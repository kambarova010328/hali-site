const STOCK_LABELS = {
  in_stock: { text: 'В наличии', cls: 'in-stock' },
  low_stock: { text: 'Осталось мало', cls: 'low-stock' },
  out_of_stock: { text: 'Нет в наличии', cls: 'out-of-stock' }
};

function getStock(id) {
  const stock = (window.STOCK && window.STOCK[id]) || 'in_stock';
  return STOCK_LABELS[stock] ? stock : 'in_stock';
}

function stockBadgeHTML(id, extraClass) {
  const status = getStock(id);
  const info = STOCK_LABELS[status];
  return '<span class="stock-badge ' + info.cls + (extraClass ? ' ' + extraClass : '') + '">' + info.text + '</span>';
}

function applyStockToCards() {
  document.querySelectorAll('.product-card[data-id]').forEach(function (card) {
    const id = card.dataset.id;
    const status = getStock(id);
    const foot = card.querySelector('.product-foot');
    if (foot && !foot.querySelector('.stock-badge')) {
      foot.insertAdjacentHTML('beforeend', stockBadgeHTML(id));
    }
    const btn = card.querySelector('.btn-add-cart');
    if (btn && status === 'out_of_stock') {
      btn.disabled = true;
      btn.textContent = 'Нет в наличии';
    }
  });
}

document.addEventListener('DOMContentLoaded', applyStockToCards);
