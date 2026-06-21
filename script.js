/* ===========================================================
   B. VAISHNAVI — PORTFOLIO  |  script.js
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (light / dark) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem('bv-theme');
    } catch (e) {
      return null;
    }
  };
  const setStoredTheme = (value) => {
    try {
      localStorage.setItem('bv-theme', value);
    } catch (e) {
      /* storage unavailable, ignore */
    }
  };

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = getStoredTheme() || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      setStoredTheme(next);
    });
  }

  /* ---------- Nav: scroll background ---------- */
  const navWrap = document.querySelector('.nav-wrap');
  const onScrollNav = () => {
    if (window.scrollY > 24) {
      navWrap.classList.add('is-scrolled');
    } else {
      navWrap.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Hero typed-text effect ---------- */
  const typedEl = document.getElementById('heroTyped');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phrases = [
    'Computer Science Engineering Student',
    'Aspiring Software Developer',
    'AI / ML Enthusiast'
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const TYPE_SPEED = 55;
      const DELETE_SPEED = 30;
      const HOLD_TIME = 1700;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      };

      setTimeout(tick, 500);
    }
  }

  /* ---------- Scroll-reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const siblingDelay = Array.from(target.parentElement.children)
            .filter(c => c.classList.contains('reveal'))
            .indexOf(target);
          setTimeout(() => {
            target.classList.add('is-visible');
          }, Math.min(siblingDelay, 5) * 80);
          revealObserver.unobserve(target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            const match = a.getAttribute('href') === `#${id}`;
            a.style.color = match ? 'var(--ink)' : '';
          });
        }
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => spyObserver.observe(s));
  }

});
