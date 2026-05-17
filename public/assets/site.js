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

  toggle.setAttribute('aria-haspopup', 'true');

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

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
  });
});

const canUseCursorEffects =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseCursorEffects) {
  const cursorAura = document.createElement('div');
  cursorAura.className = 'cursor-aura';
  cursorAura.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursorAura);
  document.documentElement.classList.add('cursor-effects');

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let rafId = 0;

  const interactiveSelector = [
    'a',
    'button',
    'summary',
    '.home-product-card',
    '.product-card',
    '.card',
    '.contact-logo-card',
    '.download-card',
    '.premium-table-grid img',
    '.eco-icon-grid span',
    '.office-panel'
  ].join(',');

  const animateCursor = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursorAura.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    rafId = window.requestAnimationFrame(animateCursor);
  };

  const setCursorPosition = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    cursorAura.classList.add('is-visible');
    if (!rafId) animateCursor();
  };

  document.addEventListener('pointermove', setCursorPosition, { passive: true });

  document.addEventListener('pointerover', (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursorAura.classList.add('is-hovering');
    }
  });

  document.addEventListener('pointerout', (event) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Element) || !nextTarget.closest(interactiveSelector)) {
      cursorAura.classList.remove('is-hovering');
    }
  });

  document.addEventListener('pointerdown', () => {
    cursorAura.classList.add('is-pressed');
  });

  document.addEventListener('pointerup', () => {
    cursorAura.classList.remove('is-pressed');
  });

  document.addEventListener('mouseleave', () => {
    cursorAura.classList.remove('is-visible', 'is-hovering', 'is-pressed');
  });
}
