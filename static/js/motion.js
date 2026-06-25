(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var tokens = {};
  var rafScheduled = false;

  function readTokens() {
    var style = getComputedStyle(root);
    tokens = {
      lerpReveal: parseFloat(style.getPropertyValue('--motion-lerp-reveal')) || 0.11,
      revealStart: parseFloat(style.getPropertyValue('--motion-reveal-start')) || 0.92,
      revealEnd: parseFloat(style.getPropertyValue('--motion-reveal-end')) || 0.38,
      staggerStep: parseFloat(style.getPropertyValue('--motion-stagger-step')) || 0.07,
    };
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function lerp(current, target, factor) {
    if (factor >= 1) return target;
    return current + (target - current) * factor;
  }

  function near(a, b, epsilon) {
    return Math.abs(a - b) < (epsilon || 0.003);
  }

  function setProgress(el, value) {
    el.style.setProperty('--motion-p', String(clamp(value, 0, 1)));
  }

  var revealEls = [];
  var revealState = new WeakMap();

  function revealTarget(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * tokens.revealStart;
    var end = vh * tokens.revealEnd;
    var span = start - end;
    if (span <= 0) return 1;
    return clamp((start - rect.top) / span, 0, 1);
  }

  function containsEmbed(el) {
    return !!el.querySelector('iframe, .video-frame, .update-card__video, .map-frame');
  }

  function initReveals() {
    revealEls = Array.prototype.slice.call(
      document.querySelectorAll('[data-motion="reveal"], .motion-bridge')
    ).filter(function (el) {
      return !containsEmbed(el);
    });
    revealEls.forEach(function (el) {
      if (!revealState.has(el)) revealState.set(el, { p: 0 });
    });

    document.querySelectorAll('[data-motion-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll('[data-motion-child]'), function (child, i) {
        if (containsEmbed(child)) return;
        child.dataset.motionDelay = String(i);
        if (!revealState.has(child)) revealState.set(child, { p: 0 });
      });
    });
  }

  function updateReveals() {
    var dirty = false;

    revealEls.forEach(function (el) {
      var state = revealState.get(el);
      if (!state) return;
      var target = reducedMotion ? 1 : revealTarget(el);
      var next = lerp(state.p, target, reducedMotion ? 1 : tokens.lerpReveal);
      if (!near(next, state.p)) dirty = true;
      state.p = next;
      setProgress(el, state.p);
    });

    document.querySelectorAll('[data-motion-child]').forEach(function (child) {
      if (containsEmbed(child)) return;
      var state = revealState.get(child);
      if (!state) return;
      var parent = child.closest('[data-motion-stagger]');
      var parentTarget = parent ? revealTarget(parent) : revealTarget(child);
      var delay = (parseInt(child.dataset.motionDelay, 10) || 0) * tokens.staggerStep;
      var target = reducedMotion ? 1 : clamp((parentTarget - delay) / (1 - delay), 0, 1);
      var next = lerp(state.p, target, reducedMotion ? 1 : tokens.lerpReveal);
      if (!near(next, state.p)) dirty = true;
      state.p = next;
      setProgress(child, state.p);
    });

    return dirty;
  }

  function tick() {
    rafScheduled = false;
    var dirty = updateReveals();
    if (dirty) scheduleFrame();
  }

  function scheduleFrame() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(tick);
  }

  function onScroll() {
    scheduleFrame();
  }

  readTokens();
  initReveals();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    readTokens();
    scheduleFrame();
  });

  scheduleFrame();

  window.JuspaidMotion = {
    refresh: function () {
      readTokens();
      initReveals();
      scheduleFrame();
    },
    tokens: function () {
      return Object.assign({}, tokens);
    },
  };
})();
