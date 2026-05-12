const slides = Array.from(document.querySelectorAll('[data-hero-slider] .hero-slide'));
let activeSlide = 0;

if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('is-active');
  }, 3600);
}

const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 140}ms`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.nav-drop-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = dropdown.classList.contains('is-open');
    dropdowns.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.nav-dropdown')) return;
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
  });
});

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.site-menu-toggle');
const menuOverlay = document.querySelector('.site-menu-overlay');

if (siteHeader && menuToggle && menuOverlay) {
  const setMenuOpen = (open) => {
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuOverlay.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('menu-lock', open);
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!siteHeader.classList.contains('menu-open'));
  });

  menuOverlay.addEventListener('click', (event) => {
    if (event.target === menuOverlay || event.target.closest('a')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
}
