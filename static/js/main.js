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

  // project detail modals (projects page)
  var openModal = null;

  function closeProjectModal() {
    if (!openModal) return;
    openModal.setAttribute('hidden', '');
    openModal.setAttribute('aria-hidden', 'true');
    openModal.classList.remove('is-open');
    openModal = null;
    document.body.classList.remove('project-modal-open');
  }

  function showProjectModal(modal) {
    if (!modal) return;
    closeProjectModal();
    openModal = modal;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('project-modal-open');
    var closeBtn = modal.querySelector('.project-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  document.querySelectorAll('[data-open-project-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-open-project-modal');
      var modal = document.getElementById('project-modal-' + id);
      showProjectModal(modal);
    });
  });

  document.querySelectorAll('[data-close-project-modal]').forEach(function (el) {
    el.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProjectModal();
  });
});
