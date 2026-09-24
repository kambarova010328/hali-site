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
