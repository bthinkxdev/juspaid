document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var closeBtn = document.querySelector('.mobile-nav .close-row button');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.classList.add('nav-open');
    });
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // faq accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // progress bar fill animation (construction status pages)
  document.querySelectorAll('.progress-fill[data-percent]').forEach(function (bar) {
    bar.style.width = bar.getAttribute('data-percent') + '%';
  });

  // hide header on scroll down, reveal on scroll up
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    var navTicking = false;
    var scrollThreshold = 10;
    var topReveal = 64;

    function setNavHidden(hidden) {
      header.classList.toggle('is-hidden', hidden);
      document.body.classList.toggle('nav-hidden', hidden);
    }

    function onNavScroll() {
      if (!navTicking) {
        requestAnimationFrame(function () {
          var y = window.scrollY;
          var delta = y - lastY;
          var menuOpen = mobileNav && mobileNav.classList.contains('open');

          if (menuOpen || y <= topReveal) {
            setNavHidden(false);
          } else if (delta > scrollThreshold) {
            setNavHidden(true);
          } else if (delta < -scrollThreshold) {
            setNavHidden(false);
          }

          lastY = y;
          navTicking = false;
        });
        navTicking = true;
      }
    }

    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }
});
