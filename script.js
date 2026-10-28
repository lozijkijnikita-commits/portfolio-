/* ============================================================
   Портфолио — интерактив
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Год в подвале ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Шапка при скролле ---------- */
  var topbar = document.querySelector('.topbar');
  function onScroll() {
    if (!topbar) return;
    topbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!burger || !nav) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- Появление блоков ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Свечение за курсором ---------- */
  var spotlight = document.querySelector('.spotlight');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (spotlight && finePointer && !reduceMotion) {
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var currentX = targetX;
    var currentY = targetY;
    var rafId = null;

    function render() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      spotlight.style.transform = 'translate3d(' + currentX + 'px,' + currentY + 'px,0)';

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }

    document.addEventListener('pointermove', function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
      document.body.classList.add('has-pointer');
      if (rafId === null) rafId = requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      document.body.classList.remove('has-pointer');
    });
  }

  /* ---------- Лёгкий параллакс превью ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project__media').forEach(function (media) {
      var img = media.querySelector('img');
      if (!img) return;

      media.addEventListener('pointermove', function (event) {
        var rect = media.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        img.style.transformOrigin = (50 + x * 18) + '% ' + (50 + y * 18) + '%';
      });

      media.addEventListener('pointerleave', function () {
        img.style.transformOrigin = '50% 50%';
      });
    });
  }
})();
