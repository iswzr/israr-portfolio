/* ═══════════════════════════════════════════
   main.js — Vanilla, zero deps
═══════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── SCROLL PROGRESS ── */
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) progress.style.width = `${(window.scrollY / h) * 100}%`;
  };

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('navbar');
  const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 60);

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const initReveals = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  };
  initReveals();

  /* ── ACTIVE NAV ── */
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

  /* ── MODAL ── */
  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  window.openModal = (html) => {
    modalBody.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  modalClose?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── COPY EMAIL ── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(el.dataset.copy).then(() => {
        const orig = el.textContent;
        el.textContent = '✓ Copied!';
        setTimeout(() => { el.textContent = orig; }, 2000);
      });
    });
  });

  /* ── EXPOSE RE-INIT FOR PROJECTS.JS ── */
  window.initReveals = initReveals;
})();