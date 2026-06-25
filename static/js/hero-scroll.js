(function () {
  var hero = document.getElementById('hero-scroll');
  if (!hero) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileQuery = window.matchMedia('(max-width: 768px)');
  var frameBase = hero.dataset.frameBase || '/static/img/herosection/';
  var frameCount = parseInt(hero.dataset.frameCount, 10) || 240;
  var canvas = hero.querySelector('.hero-scroll__canvas');
  var track = hero.querySelector('.hero-scroll__track');
  var slides = hero.querySelectorAll('.hero-scroll__slide');
  var hint = hero.querySelector('.hero-scroll__hint');
  var banner = hero.querySelector('.hero-scroll__banner');

  if (!canvas || !track) return;

  var ctx = canvas.getContext('2d');
  var images = new Array(frameCount);
  var currentFrame = -1;
  var ticking = false;
  var autoplayStart = 0;
  var autoplayRaf = null;
  var AUTOPLAY_MS = 12000;

  function isMobile() {
    return mobileQuery.matches;
  }

  function framePath(index) {
    var num = String(index + 1).padStart(3, '0');
    return frameBase + 'ezgif-frame-' + num + '.png';
  }

  function loadFrame(index) {
    if (index < 0 || index >= frameCount) return Promise.resolve();
    if (images[index] && images[index].complete) return Promise.resolve();
    if (images[index] && images[index].__loading) return images[index].__loading;

    var img = images[index] || new Image();
    images[index] = img;

    img.__loading = new Promise(function (resolve) {
      img.onload = function () { resolve(); };
      img.onerror = function () { resolve(); };
      if (!img.src) img.src = framePath(index);
      if (img.complete) resolve();
    });

    return img.__loading;
  }

  function preloadFrames() {
    var batch = 0;
    function loadBatch() {
      var start = batch * 12;
      if (start >= frameCount) return;
      var promises = [];
      for (var i = start; i < Math.min(start + 12, frameCount); i++) {
        promises.push(loadFrame(i));
      }
      Promise.all(promises).then(function () {
        batch += 1;
        if (batch === 1) drawFrame(0);
        requestAnimationFrame(loadBatch);
      });
    }
    loadFrame(0).then(loadBatch);
  }

  function resizeCanvas() {
    var target = banner || canvas;
    var rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    if (currentFrame >= 0) drawFrame(currentFrame);
  }

  function drawFrame(index) {
    var img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    var cw = canvas.width;
    var ch = canvas.height;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var scale = Math.max(cw / iw, ch / ih);
    var dw = iw * scale;
    var dh = ih * scale;
    var dx = (cw - dw) / 2;
    var dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    currentFrame = index;
  }

  function getScrollProgress() {
    var rect = track.getBoundingClientRect();
    var scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    var scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    return scrolled / scrollable;
  }

  function getAutoplayProgress() {
    if (!autoplayStart) return 0;
    return ((performance.now() - autoplayStart) % AUTOPLAY_MS) / AUTOPLAY_MS;
  }

  function getProgress() {
    if (reducedMotion) return 0;
    if (isMobile()) return getAutoplayProgress();
    return getScrollProgress();
  }

  function updateSlides(progress) {
    slides.forEach(function (slide, index) {
      var start = parseFloat(slide.dataset.start || '0');
      var end = parseFloat(slide.dataset.end || '1');
      var isLast = index === slides.length - 1;
      var active = progress >= start && (isLast ? progress <= end : progress < end);
      slide.classList.toggle('is-active', active);
    });

    if (hint) {
      hint.classList.toggle('is-hidden', progress > 0.06);
    }
    hero.classList.toggle('is-complete', progress > 0.94);
  }

  function applyProgress(progress) {
    var frameIndex = Math.min(frameCount - 1, Math.floor(progress * (frameCount - 1)));

    loadFrame(frameIndex);
    loadFrame(Math.min(frameCount - 1, frameIndex + 1));
    loadFrame(Math.max(0, frameIndex - 1));

    if (frameIndex !== currentFrame) {
      drawFrame(frameIndex);
    }

    updateSlides(progress);
  }

  function update() {
    ticking = false;
    applyProgress(getProgress());
  }

  function onScroll() {
    if (isMobile()) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function autoplayLoop() {
    if (!isMobile() || reducedMotion || document.hidden) {
      autoplayRaf = null;
      return;
    }
    applyProgress(getAutoplayProgress());
    autoplayRaf = requestAnimationFrame(autoplayLoop);
  }

  function startAutoplay() {
    if (reducedMotion || !isMobile()) return;
    hero.classList.add('is-autoplay');
    autoplayStart = performance.now();
    if (!autoplayRaf) autoplayLoop();
  }

  function stopAutoplay() {
    hero.classList.remove('is-autoplay');
    if (autoplayRaf) {
      cancelAnimationFrame(autoplayRaf);
      autoplayRaf = null;
    }
  }

  function onModeChange() {
    if (isMobile()) {
      startAutoplay();
    } else {
      stopAutoplay();
      update();
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      if (autoplayRaf) {
        cancelAnimationFrame(autoplayRaf);
        autoplayRaf = null;
      }
      return;
    }
    if (isMobile() && !reducedMotion) {
      autoplayStart = performance.now() - getAutoplayProgress() * AUTOPLAY_MS;
      if (!autoplayRaf) autoplayLoop();
    }
  }

  mobileQuery.addEventListener('change', onModeChange);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });

  resizeCanvas();
  preloadFrames();
  onModeChange();
  requestAnimationFrame(function () {
    resizeCanvas();
    update();
  });
})();
