document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
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

  // contact form fake submit
  var form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        form.reset();
      }
    });
  }
});
