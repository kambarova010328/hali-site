document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('catalog-search');
  var sortSelect = document.getElementById('catalog-sort');
  var stockCheckbox = document.getElementById('catalog-instock');
  var resetBtn = document.getElementById('catalog-reset');
  var emptyState = document.getElementById('catalog-empty');
  if (!searchInput) return;

  var products = window.PRODUCTS || {};
  var stock = window.STOCK || {};
  var sections = document.querySelectorAll('.catalog-section');

  var originalOrder = new Map();
  sections.forEach(function (section) {
    var grid = section.querySelector('.product-grid');
    if (grid) originalOrder.set(grid, Array.prototype.slice.call(grid.children));
  });

  function haystack(id) {
    var p = products[id];
    if (!p) return '';
    var parts = [p.name || ''];
    if (p.specs) {
      p.specs.forEach(function (row) { parts.push(row[1] || ''); });
    }
    return parts.join(' ').toLowerCase();
  }

  function updateResetVisibility() {
    var active = searchInput.value.trim() !== '' || stockCheckbox.checked || sortSelect.value !== 'default';
    resetBtn.hidden = !active;
  }

  function applyFilters() {
    var query = searchInput.value.trim().toLowerCase();
    var onlyInStock = stockCheckbox.checked;
    var anyVisible = false;

    sections.forEach(function (section) {
      var cards = section.querySelectorAll('.product-card[data-id]');
      var visibleCount = 0;
      cards.forEach(function (card) {
        var id = card.getAttribute('data-id');
        var matchesQuery = !query || haystack(id).indexOf(query) !== -1;
        var matchesStock = !onlyInStock || stock[id] !== 'out_of_stock';
        var visible = matchesQuery && matchesStock;
        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
      });
      var hasResults = visibleCount > 0;
      section.hidden = !hasResults;
      if (hasResults) anyVisible = true;
      var navLink = document.querySelector('.catalog-nav a[href="#' + section.id + '"]');
      if (navLink) navLink.style.display = hasResults ? '' : 'none';
    });

    emptyState.hidden = anyVisible;
    updateResetVisibility();
  }

  function applySort() {
    var mode = sortSelect.value;
    originalOrder.forEach(function (originalCards, grid) {
      var cards = originalCards.slice();
      if (mode === 'price-asc' || mode === 'price-desc') {
        cards.sort(function (a, b) {
          var pa = (products[a.getAttribute('data-id')] || {}).price || 0;
          var pb = (products[b.getAttribute('data-id')] || {}).price || 0;
          return mode === 'price-asc' ? pa - pb : pb - pa;
        });
      }
      cards.forEach(function (card) { grid.appendChild(card); });
    });
  }

  searchInput.addEventListener('input', applyFilters);
  stockCheckbox.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', function () {
    applySort();
    updateResetVisibility();
  });
  resetBtn.addEventListener('click', function () {
    searchInput.value = '';
    stockCheckbox.checked = false;
    sortSelect.value = 'default';
    applySort();
    applyFilters();
  });
});
