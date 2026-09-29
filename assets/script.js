document.addEventListener('DOMContentLoaded', function () {
  // reviews carousel
  var reviewsTrack = document.querySelector('.reviews-grid');
  if (reviewsTrack) {
    var prevBtn = document.querySelector('.reviews-arrow.prev');
    var nextBtn = document.querySelector('.reviews-arrow.next');
    var scrollByCard = function (dir) {
      var card = reviewsTrack.querySelector('.review-card');
      if (!card) return;
      var gap = parseFloat(getComputedStyle(reviewsTrack).columnGap) || 20;
      reviewsTrack.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
  }

  // review photo lightbox
  var reviewPhotos = document.querySelectorAll('.review-photo img');
  if (reviewPhotos.length) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Закрыть">&times;</button><img alt="">';
    document.body.appendChild(overlay);
    var overlayImg = overlay.querySelector('img');

    var closeLightbox = function () { overlay.classList.remove('show'); };

    reviewPhotos.forEach(function (img) {
      img.addEventListener('click', function () {
        overlayImg.src = img.src;
        overlayImg.alt = img.alt || '';
        overlay.classList.add('show');
      });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target !== overlayImg) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // catalog sticky nav active state on scroll
  var catalogLinks = document.querySelectorAll('.catalog-nav a');
  var sections = document.querySelectorAll('.catalog-section');
  if (catalogLinks.length && sections.length) {
    var setActive = function () {
      var scrollPos = window.scrollY + 160;
      var currentId = sections[0].id;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) currentId = sec.id;
      });
      catalogLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
      });
    };
    window.addEventListener('scroll', setActive);
    setActive();
  }

  // banner carousel
  var slides = document.querySelectorAll('.banner-slide');
  var dots = document.querySelectorAll('.banner-dot');
  if (slides.length > 1) {
    var current = 0;
    var timer = null;

    var goTo = function (index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    var restart = function () {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restart(); });
    });

    var prevBtn = document.querySelector('.banner-arrow.prev');
    var nextBtn = document.querySelector('.banner-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });

    restart();
  }

  // contact form submit via WhatsApp
  var form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var topic = document.getElementById('topic').value;
      var message = document.getElementById('message').value.trim();

      var lines = ['Заявка с сайта HALI:', ''];
      lines.push('Имя: ' + name);
      lines.push('Телефон: ' + phone);
      lines.push('Интересует: ' + topic);
      if (message) lines.push('Комментарий: ' + message);

      var text = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/77479615804?text=' + text, '_blank');

      var success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        form.reset();
      }
    });
  }
});
