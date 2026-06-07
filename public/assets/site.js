const slides = Array.from(document.querySelectorAll('[data-hero-slider] .hero-slide'));
const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeSlide = 0;

const loadHeroSlideImage = (slide) => {
  const pendingSrc = slide?.dataset?.src;
  if (!pendingSrc) return;
  slide.src = pendingSrc;
  slide.removeAttribute('data-src');
};

document.body.classList.add('immersive-ready');

const setHeroSlide = (index) => {
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  loadHeroSlideImage(slides[nextIndex]);
  slides[activeSlide]?.classList.remove('is-active');
  heroDots[activeSlide]?.classList.remove('is-active');
  heroDots[activeSlide]?.removeAttribute('aria-current');

  activeSlide = nextIndex;

  slides[activeSlide].classList.add('is-active');
  heroDots[activeSlide]?.classList.add('is-active');
  heroDots[activeSlide]?.setAttribute('aria-current', 'true');
};

if (slides.length > 1) {
  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      setHeroSlide(Number(dot.dataset.heroDot || 0));
    });
  });

  const warmDeferredHeroSlides = () => {
    const loadRest = () => slides.slice(1).forEach(loadHeroSlideImage);

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadRest, { timeout: 2400 });
    } else {
      window.setTimeout(loadRest, 1400);
    }
  };

  if (document.readyState === 'complete') {
    warmDeferredHeroSlides();
  } else {
    window.addEventListener('load', warmDeferredHeroSlides, { once: true });
  }

  if (!reducedMotion) {
    window.setInterval(() => {
      setHeroSlide(activeSlide + 1);
    }, 3600);
  }
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

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

const hero = document.querySelector('.visual-hero');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let scrollFrame = null;
let pointerFrame = null;

const updateImmersiveScroll = () => {
  scrollFrame = null;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  document.documentElement.style.setProperty('--scroll-progress', `${Math.min(window.scrollY / maxScroll, 1)}`);

  if (hero && !reducedMotion) {
    const rect = hero.getBoundingClientRect();
    const offset = Math.max(Math.min(-rect.top * 0.08, 32), -18);
    hero.style.setProperty('--hero-scroll-y', `${offset}px`);
  }
};

const requestImmersiveScroll = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateImmersiveScroll);
};

window.addEventListener('scroll', requestImmersiveScroll, { passive: true });
window.addEventListener('resize', requestImmersiveScroll);
updateImmersiveScroll();

if (hero && finePointer && !reducedMotion) {
  hero.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = null;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      hero.style.setProperty('--hero-glow-x', `${Math.round(x * 100)}%`);
      hero.style.setProperty('--hero-glow-y', `${Math.round(y * 100)}%`);
      hero.style.setProperty('--hero-pan-x', `${((x - 0.5) * -14).toFixed(2)}px`);
      hero.style.setProperty('--hero-pan-y', `${((y - 0.5) * -10).toFixed(2)}px`);
    });
  });

  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-pan-x', '0px');
    hero.style.setProperty('--hero-pan-y', '0px');
    hero.style.setProperty('--hero-glow-x', '50%');
    hero.style.setProperty('--hero-glow-y', '42%');
  });
}

if (finePointer && !reducedMotion) {
  const tiltItems = Array.from(document.querySelectorAll('.home-product-card, .card, .download-card, .contact-logo-card, .seo-link-grid a, .eco-icon-grid span, .logic-point-grid span'));

  tiltItems.forEach((item) => {
    item.classList.add('immersive-tilt');

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      item.style.setProperty('--glow-x', `${Math.round(x * 100)}%`);
      item.style.setProperty('--glow-y', `${Math.round(y * 100)}%`);
      item.style.setProperty('--tilt-y', `${((x - 0.5) * 4.8).toFixed(2)}deg`);
      item.style.setProperty('--tilt-x', `${((0.5 - y) * 4.8).toFixed(2)}deg`);
    });

    item.addEventListener('pointerleave', () => {
      item.style.setProperty('--tilt-x', '0deg');
      item.style.setProperty('--tilt-y', '0deg');
      item.style.setProperty('--glow-x', '50%');
      item.style.setProperty('--glow-y', '0%');
    });
  });
}

const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
const siteHeader = document.querySelector('.site-header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 18);
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateHeaderState);
updateHeaderState();

const closeMobileMenu = () => {
  if (!siteHeader || !mobileMenuToggle) return;
  siteHeader.classList.remove('is-mobile-nav-open');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('mobile-nav-open');
};

if (siteHeader && mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = siteHeader.classList.toggle('is-mobile-nav-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('mobile-nav-open', isOpen);
  });
}

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
  if (siteHeader?.classList.contains('is-mobile-nav-open') && !event.target.closest('.site-header')) {
    closeMobileMenu();
  }

  if (event.target.closest('.nav-dropdown')) return;
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeMobileMenu();
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

const trackLeadEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, {
    page_title: document.title,
    page_location: window.location.href,
    ...parameters
  });
};

const getLinkText = (link) => {
  return link.getAttribute('aria-label') || link.textContent.trim() || link.href;
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  const absoluteHref = link.href || href;
  const linkText = getLinkText(link);

  if (link.hasAttribute('download') || href.includes('/downloads/') || href.endsWith('.pdf')) {
    trackLeadEvent('catalogue_download', { link_text: linkText, link_url: absoluteHref });
    return;
  }

  if (href.startsWith('mailto:')) {
    trackLeadEvent('email_click', { link_text: linkText, link_url: href });
    return;
  }

  if (absoluteHref.includes('wa.me') || absoluteHref.includes('whatsapp.com')) {
    trackLeadEvent('whatsapp_click', { link_text: linkText, link_url: absoluteHref });
    return;
  }

  if (absoluteHref.includes('instagram.com')) {
    trackLeadEvent('instagram_click', { link_text: linkText, link_url: absoluteHref });
    return;
  }

  if (absoluteHref.includes('linkedin.com')) {
    trackLeadEvent('linkedin_click', { link_text: linkText, link_url: absoluteHref });
    return;
  }

  if (absoluteHref.includes('google.com/maps') || absoluteHref.includes('maps.app.goo.gl')) {
    trackLeadEvent('google_maps_click', { link_text: linkText, link_url: absoluteHref });
    return;
  }

  if (/airlaid-(cocktail|dinner|pocket)|\/products\b/.test(href)) {
    trackLeadEvent('product_interest_click', { link_text: linkText, link_url: absoluteHref });
  }
});

const quoteTriggerPattern = /request\s+(quote|sample|samples)|bulk pricing/i;
const quoteSheetEndpoint = 'https://script.google.com/macros/s/AKfycbxd9gp-wyagShepR2neMeCERPpd1sIx0x4gf84i074WhxhpFEbLetYzgd49MXQiLcg1/exec';
const quoteSuccessMessage = 'Thank you. We received your request.';

const postQuoteLead = (data) => {
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(quoteSheetEndpoint, data)) {
      return Promise.resolve();
    }
  } catch (error) {
    // Some older browsers reject FormData in sendBeacon; fetch is the fallback.
  }

  return fetch(quoteSheetEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    body: data,
    keepalive: true
  });
};

const buildQuoteModal = () => {
  const modal = document.createElement('div');
  modal.className = 'quote-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'false');
  modal.setAttribute('aria-labelledby', 'quote-modal-title');
  modal.hidden = true;
  modal.innerHTML = `
    <div class="quote-modal-backdrop" data-quote-close></div>
    <div class="quote-dialog">
      <button class="quote-close" type="button" data-quote-close aria-label="Close quote form">Close</button>
      <div class="eyebrow">Sample Enquiry</div>
      <h2 id="quote-modal-title">Request samples</h2>
      <form class="quote-form" novalidate>
        <input type="hidden" name="source" />
        <label>
          <span>Name</span>
          <input name="name" type="text" autocomplete="name" />
        </label>
        <label>
          <span>Company</span>
          <input name="company" type="text" autocomplete="organization" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autocomplete="email" />
        </label>
        <label>
          <span>Contact number</span>
          <input name="phone" type="tel" autocomplete="tel" />
        </label>
        <label class="quote-field-wide">
          <span>Query</span>
          <textarea name="query" rows="4"></textarea>
        </label>
        <div class="quote-actions">
          <button class="btn btn-gold" type="submit">Submit Request</button>
          <p class="quote-status" role="status" aria-live="polite"></p>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
};

const buildSampleFloatTrigger = () => {
  const button = document.createElement('button');
  button.className = 'sample-float-trigger';
  button.type = 'button';
  button.setAttribute('aria-label', 'Request samples');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `
    <span class="sample-float-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M7 4h10v16H7z"></path><path d="M9.5 6.5h5"></path><path d="M9.5 10h5"></path><path d="M9.5 13.5h3"></path></svg>
    </span>
    <span>Request Sample?</span>
  `;
  document.body.appendChild(button);
  return button;
};

const quoteModal = buildQuoteModal();
const quoteForm = quoteModal.querySelector('.quote-form');
const quoteDialog = quoteModal.querySelector('.quote-dialog');
const isContactPage = window.location.pathname.includes('/contact');
const sampleFloatTrigger = !isContactPage ? buildSampleFloatTrigger() : null;
let lastQuoteTrigger = null;
let quoteAutoShown = sessionStorage.getItem('silqueQuoteAutoShown') === '1';
let quoteCloseTimer = null;
let quotePanelAnimation = null;
let quoteOpenedScrollY = 0;
let quoteLastOpenWasAuto = false;
let quoteIgnoreScrollUntil = 0;
let quoteFormEngaged = false;

const removeQuoteScrollClose = () => {
  window.removeEventListener('scroll', closeQuoteAfterScroll);
};

const isCompactTouchViewport = () => {
  return window.matchMedia('(max-width: 760px)').matches && (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
};

const quoteFormHasValues = () => {
  return Array.from(quoteForm.elements).some((field) => {
    if (!['INPUT', 'TEXTAREA'].includes(field.tagName)) return false;
    if (field.name === 'source') return false;
    return String(field.value || '').trim().length > 0;
  });
};

const protectQuoteFormFromAutoCollapse = () => {
  quoteFormEngaged = true;
  quoteIgnoreScrollUntil = Date.now() + 10000;
};

function closeQuoteAfterScroll() {
  if (!quoteModal.classList.contains('is-open')) return;
  if (isCompactTouchViewport()) return;
  if (quoteFormEngaged || quoteFormHasValues()) return;
  if (Date.now() < quoteIgnoreScrollUntil) return;
  if (quoteModal.contains(document.activeElement)) return;
  if (Math.abs(window.scrollY - quoteOpenedScrollY) < 120) return;
  closeQuoteModal({ restoreFocus: false });
}

const quoteMotionAllowed = () => {
  return typeof quoteDialog.animate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const animateQuotePanel = (keyframes, options) => {
  if (!quoteMotionAllowed()) return null;
  quotePanelAnimation?.cancel();
  quotePanelAnimation = quoteDialog.animate(keyframes, options);
  return quotePanelAnimation;
};

if (quoteMotionAllowed()) {
  quoteModal.classList.add('is-motion-controlled');
}

quoteModal.addEventListener('pointerdown', () => {
  quoteIgnoreScrollUntil = Date.now() + 1600;
});

quoteForm.addEventListener('pointerdown', (event) => {
  if (event.target.matches('input, textarea, button, label')) {
    protectQuoteFormFromAutoCollapse();
  }
});

quoteForm.addEventListener('input', protectQuoteFormFromAutoCollapse);
quoteForm.addEventListener('change', protectQuoteFormFromAutoCollapse);
quoteForm.addEventListener('animationstart', (event) => {
  if (event.animationName === 'quote-autofill-start') {
    protectQuoteFormFromAutoCollapse();
  }
});

quoteModal.addEventListener('focusin', () => {
  quoteIgnoreScrollUntil = Date.now() + 2200;
});

const setQuoteAnimationOrigin = (trigger) => {
  if (!trigger || !quoteDialog) return;
  quoteDialog.style.setProperty('--quote-origin-x', '50%');
  quoteDialog.style.setProperty('--quote-origin-y', '50%');

  const triggerRect = trigger.getBoundingClientRect();
  quoteModal.classList.add('is-measuring');
  const dialogRect = quoteDialog.getBoundingClientRect();
  quoteModal.classList.remove('is-measuring');
  const triggerX = triggerRect.left + triggerRect.width / 2;
  const triggerY = triggerRect.top + triggerRect.height / 2;

  quoteDialog.style.setProperty('--quote-origin-x', `${triggerX - dialogRect.left}px`);
  quoteDialog.style.setProperty('--quote-origin-y', `${triggerY - dialogRect.top}px`);
};

const closeQuoteModal = (options = {}) => {
  if (!quoteModal.classList.contains('is-open')) return;
  window.clearTimeout(quoteCloseTimer);
  quotePanelAnimation?.cancel();
  removeQuoteScrollClose();
  quoteFormEngaged = false;
  sampleFloatTrigger?.classList.remove('is-active');
  sampleFloatTrigger?.setAttribute('aria-expanded', 'false');
  quoteModal.classList.add('is-closing');
  quoteModal.classList.remove('is-open');
  document.body.classList.remove('quote-modal-open');

  const finishClose = () => {
    if (!quoteModal.classList.contains('is-open')) {
      quoteModal.hidden = true;
      quoteModal.classList.remove('is-closing');
    }
  };

  const closeAnimation = animateQuotePanel([
    { opacity: 1, transform: 'translateX(0)' },
    { opacity: 0, transform: 'translateX(calc(100% + 32px))' }
  ], { duration: 280, easing: 'cubic-bezier(.36,0,.22,1)', fill: 'both' });

  if (closeAnimation) {
    closeAnimation.finished.then(finishClose).catch(() => {});
    return;
  }

  quoteCloseTimer = window.setTimeout(finishClose, 420);
};

const openQuoteModal = (trigger, options = {}) => {
  lastQuoteTrigger = trigger;
  quoteLastOpenWasAuto = Boolean(options.auto);
  trackLeadEvent(options.auto ? 'request_sample_auto_open' : 'request_sample_open', {
    trigger_text: trigger ? getLinkText(trigger) : 'automatic'
  });
  if (options.auto) {
    quoteAutoShown = true;
    sessionStorage.setItem('silqueQuoteAutoShown', '1');
  }
  window.clearTimeout(quoteCloseTimer);
  quotePanelAnimation?.cancel();
  quoteFormEngaged = false;
  quoteModal.classList.remove('is-closing');
  quoteModal.hidden = false;
  sampleFloatTrigger?.classList.add('is-active');
  sampleFloatTrigger?.setAttribute('aria-expanded', 'true');
  quoteForm.elements.source.value = `${document.title} | ${window.location.href}`;
  quoteForm.querySelector('.quote-status').textContent = '';
  window.requestAnimationFrame(() => {
    void quoteDialog.offsetWidth;
    window.requestAnimationFrame(() => {
      quoteModal.classList.add('is-open');
      quoteOpenedScrollY = window.scrollY;
      window.setTimeout(() => {
        window.addEventListener('scroll', closeQuoteAfterScroll, { passive: true });
      }, 260);
      animateQuotePanel([
        { opacity: 0, transform: 'translateX(calc(100% + 32px))' },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
      if (!options.auto) {
        window.setTimeout(() => quoteForm.elements.name.focus(), 220);
      }
    });
  });
};

document.addEventListener('click', (event) => {
  const closeButton = event.target.closest('[data-quote-close]');
  if (closeButton) {
    event.preventDefault();
    closeQuoteModal();
    return;
  }

  const trigger = event.target.closest('a, button');
  if (!trigger || trigger.closest('.quote-modal')) return;
  const label = trigger.textContent.trim();
  if (!quoteTriggerPattern.test(label)) return;

  event.preventDefault();
  if (trigger === sampleFloatTrigger && quoteModal.classList.contains('is-open')) {
    closeQuoteModal({ restoreFocus: false });
    return;
  }

  openQuoteModal(trigger);
});

quoteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }

  const data = new FormData(quoteForm);
  ['name', 'company', 'email', 'phone', 'query'].forEach((field) => {
    const value = String(data.get(field) || '').trim();
    data.set(field, value || '0');
  });
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const status = quoteForm.querySelector('.quote-status');
  submitButton.disabled = true;
  status.textContent = quoteSuccessMessage;
  trackLeadEvent('request_sample_submit', {
    form_location: window.location.pathname,
    lead_source: String(data.get('source') || '')
  });
  postQuoteLead(data).catch(() => {
    trackLeadEvent('request_sample_submit_error', {
      form_location: window.location.pathname
    });
    status.textContent = 'Could not submit. Please WhatsApp or email us.';
  }).finally(() => {
    submitButton.disabled = false;
  });

  quoteForm.reset();
  window.setTimeout(closeQuoteModal, 900);
});

// Interactive color swatches preview
const initColorSwatches = () => {
  const swatchesContainer = document.querySelector('.colour-swatches.labelled');
  if (!swatchesContainer) return;

  const infoLabel = document.createElement('p');
  infoLabel.className = 'swatch-info-label';
  infoLabel.style.marginTop = '18px';
  infoLabel.style.fontSize = '0.86rem';
  infoLabel.style.color = 'rgba(255,255,255,.8)';
  infoLabel.style.minHeight = '1.8em';
  infoLabel.style.textAlign = 'center';
  infoLabel.style.fontWeight = '500';
  infoLabel.innerHTML = '<em>Click any swatch above to preview color options and B2B configurations.</em>';
  swatchesContainer.parentNode.insertBefore(infoLabel, swatchesContainer.nextSibling);

  const cocktailCard = document.querySelector('#cocktail img');
  const dinnerCard = document.querySelector('#dinner img');
  const pocketCard = document.querySelector('#pocket img');

  const swatches = swatchesContainer.querySelectorAll('span');
  
  swatches.forEach(span => {
    span.style.cursor = 'pointer';
    span.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
    span.style.borderRadius = '4px';
    span.style.padding = '4px 8px';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.gap = '6px';
    
    span.addEventListener('pointerenter', () => {
      span.style.transform = 'translateY(-2px)';
    });
    span.addEventListener('pointerleave', () => {
      if (!span.classList.contains('is-active')) {
        span.style.transform = 'translateY(0)';
      }
    });
  });

  const colorDetails = {
    white: {
      text: "Pure White — A crisp, clean classic for formal dining, wedding banquets, and high-standard room service.",
      images: {
        cocktail: '/silque-generated-cocktail-detail.webp',
        dinner: '/silque-premium-table-presentation.webp',
        pocket: '/silque-pocket-napkin-table-setting.png'
      }
    },
    ivory: {
      text: "Classic Ivory — Soft linen-tone that adds warm, organic sophistication to standard hotel covers.",
      images: {
        cocktail: '/silque-product-cocktail.webp',
        dinner: '/silque-colour-sample-fan.webp',
        pocket: '/silque-pocket-napkin-final.png'
      }
    },
    champagne: {
      text: "Luxury Champagne — A warm golden-beige hue that elevates luxury catering, receptions, and corporate galas.",
      images: {
        cocktail: '/silque-product-cocktail.webp',
        dinner: '/silque-colour-sample-fan.webp',
        pocket: '/silque-pocket-napkin-final.png'
      }
    },
    charcoal: {
      text: "Modern Charcoal — A sleek slate grey, perfect for industrial, minimalist, or contemporary restaurant settings.",
      images: {
        cocktail: '/silque-colour-range-stacks.webp',
        dinner: '/silque-colour-range-stacks.webp',
        pocket: '/silque-colour-pocket-range.webp'
      }
    },
    navy: {
      text: "Imperial Navy — Deep royal blue, bringing nautical prestige or rich corporate branding to table presentations.",
      images: {
        cocktail: '/silque-colour-range-stacks.webp',
        dinner: '/silque-colour-range-stacks.webp',
        pocket: '/silque-colour-pocket-range.webp'
      }
    },
    sage: {
      text: "Organic Sage — Soft, muted botanical green ideal for outdoor catering, garden weddings, and eco-themed dining.",
      images: {
        cocktail: '/silque-product-cocktail.webp',
        dinner: '/silque-colour-sample-fan.webp',
        pocket: '/silque-pocket-napkin-final.png'
      }
    },
    burgundy: {
      text: "Royal Burgundy — A rich crimson-red tone that makes formal receptions, events, and wine pairings stand out.",
      images: {
        cocktail: '/silque-colour-range-stacks.webp',
        dinner: '/silque-dinner-napkin-final.png',
        pocket: '/silque-pocket-napkin-red-slate.png'
      }
    },
    blush: {
      text: "Soft Blush — A delicate pastel pink, ideal for afternoon teas, luxury bakeries, and floral banquet themes.",
      images: {
        cocktail: '/silque-product-cocktail.webp',
        dinner: '/silque-colour-sample-fan.webp',
        pocket: '/silque-pocket-napkin-final.png'
      }
    }
  };

  swatches.forEach(span => {
    const colorName = span.textContent.trim().toLowerCase();
    
    span.addEventListener('click', () => {
      swatches.forEach(s => {
        s.classList.remove('is-active');
        s.style.border = 'none';
        s.style.background = 'transparent';
        s.style.transform = 'translateY(0)';
      });

      span.classList.add('is-active');
      span.style.border = '1px solid var(--gold)';
      span.style.background = 'rgba(198,168,92,.08)';
      span.style.transform = 'translateY(-2px)';

      const details = colorDetails[colorName];
      if (details) {
        infoLabel.innerHTML = `<strong>${details.text}</strong> <a href="/contact" style="color:var(--gold); margin-left:8px; text-decoration:underline; font-size:0.8rem;">Request physical sample</a>`;
        
        if (cocktailCard && dinnerCard && pocketCard && details.images) {
          [cocktailCard, dinnerCard, pocketCard].forEach(img => {
            img.style.opacity = '0.3';
            img.style.transition = 'opacity 0.25s ease';
          });
          
          setTimeout(() => {
            if (details.images.cocktail) cocktailCard.src = details.images.cocktail;
            if (details.images.dinner) dinnerCard.src = details.images.dinner;
            if (details.images.pocket) pocketCard.src = details.images.pocket;
            
            [cocktailCard, dinnerCard, pocketCard].forEach(img => {
              img.style.opacity = '1';
            });
          }, 250);
        }
      }
    });
  });
};

initColorSwatches();


