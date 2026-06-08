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
      <button class="quote-close" type="button" data-quote-close aria-label="Close quote form">&times;</button>
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

const quoteModal = buildQuoteModal();
const quoteForm = quoteModal.querySelector('.quote-form');
const quoteDialog = quoteModal.querySelector('.quote-dialog');
const isContactPage = window.location.pathname.includes('/contact');
const sampleFloatTrigger = null;
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
  // Automatically close chatbot widget if it is open
  const chatbotWidget = document.querySelector('.dipti-chatbot-container');
  const chatbotTrigger = document.querySelector('.dipti-chatbot-trigger');
  if (chatbotWidget && chatbotWidget.classList.contains('dipti-open')) {
    chatbotWidget.classList.remove('dipti-open');
    chatbotTrigger?.classList.remove('is-active');
  }

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

const buildChatbotDipti = () => {
  const container = document.createElement('div');
  container.className = 'dipti-chatbot-container';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'SILQUE Help & Support');
  container.innerHTML = `
    <div class="dipti-chat-window">
      <!-- STATE A: Unified Sourcing Menu -->
      <div class="dipti-menu-view" id="dipti-menu-view">
        <div class="dipti-chat-header">
          <div class="dipti-chat-avatar" style="border: 2.2px solid var(--gold); background: #101827; padding: 2px;">
            <img src="/silque-logo-square.png" alt="SILQUE Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
          <div class="dipti-chat-title-info">
            <h3>SILQUE Sourcing</h3>
            <span>How can we help you today?</span>
          </div>
          <button class="dipti-chat-close" type="button" aria-label="Close Chat">&times;</button>
        </div>
        
        <div class="dipti-menu-content">
          <p class="dipti-menu-intro">Choose an option below to connect with us:</p>
          
          <div class="dipti-menu-options">
            <button class="dipti-menu-option-card" type="button" id="dipti-opt-ai">
              <div class="dipti-option-icon robot">🤖</div>
              <div class="dipti-option-details">
                <h4>Talk to Saksham (AI Sourcing Agent)</h4>
                <p>Instant answers about specifications, custom printing, and delivery.</p>
              </div>
              <div class="dipti-option-arrow">➔</div>
            </button>

            <button class="dipti-menu-option-card" type="button" id="dipti-opt-quote">
              <div class="dipti-option-icon document">📝</div>
              <div class="dipti-option-details">
                <h4>Request Quote / Samples</h4>
                <p>Fill out our B2B form to receive bulk quotes and free sample kits.</p>
              </div>
              <div class="dipti-option-arrow">➔</div>
            </button>

            <a class="dipti-menu-option-card" href="https://wa.me/919122428064?text=Hi%2C%20I%20want%20to%20enhance%20my%20table%20presentation.%20Let's%20connect." target="_blank" rel="noopener noreferrer" id="dipti-opt-wa">
              <div class="dipti-option-icon whatsapp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color: #25D366; display: block;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.638 2.022 14.162.99 11.536.99c-5.438 0-9.863 4.373-9.867 9.803-.001 1.73.457 3.42 1.32 4.938L1.936 21.099l5.807-1.52L6.59 19.154zM17.91 14.65c-.307-.154-1.82-.9-2.102-1.003-.283-.103-.49-.154-.695.154-.205.308-.795.998-.973 1.203-.178.205-.356.23-.663.077-.307-.154-1.3-.48-2.476-1.53-1.026-.917-1.413-2.036-1.618-2.385-.205-.348-.022-.538.13-.69.138-.135.307-.358.46-.538.154-.18.205-.307.307-.512.103-.205.051-.385-.026-.538-.077-.154-.695-1.68-.953-2.302-.25-.604-.52-.519-.695-.53-.179-.011-.385-.013-.59-.013-.205 0-.538.077-.82.384-.282.308-1.077 1.05-1.077 2.564 0 1.513 1.1 2.974 1.254 3.18 1.583 2.146 3.1 2.872 5.061 3.719 1.961.846 1.961.564 2.308.53.346-.035 1.82-.744 2.077-1.46.257-.718.257-1.333.18-1.461-.077-.128-.282-.205-.59-.359z"/></svg>
              </div>
              <div class="dipti-option-details">
                <h4>WhatsApp Us Directly</h4>
                <p>Message our support team on WhatsApp for order updates or custom branding.</p>
              </div>
              <div class="dipti-option-arrow">➔</div>
            </a>
          </div>
        </div>
        
        <div class="dipti-menu-footer">
          <span>⚡ Typically replies in under 5 minutes</span>
        </div>
      </div>

      <!-- STATE B: AI Chat Assistant View -->
      <div class="dipti-chat-view" id="dipti-chat-view" style="display: none; flex-direction: column; height: 100%;">
        <div class="dipti-chat-header">
          <button class="dipti-chat-back" type="button" id="dipti-back-btn" aria-label="Go Back">←</button>
          <div class="dipti-chat-avatar" style="width: 32px; height: 32px; border: 1.5px solid var(--gold); background: #101827; padding: 1.5px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="/saksham-avatar.png" alt="Saksham Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          </div>
          <div class="dipti-chat-title-info">
            <h3>Saksham</h3>
            <span>SILQUE AI Assistant</span>
          </div>
          <button class="dipti-chat-close" type="button" aria-label="Close Chat">&times;</button>
        </div>
        
        <div class="dipti-chat-messages" id="dipti-messages">
          <div class="dipti-message assistant">
            <div class="message-content">
              Hello! I am <strong>Saksham</strong>, your SILQUE AI Assistant. How can I help you today?
            </div>
          </div>
          
          <div class="dipti-quick-replies" id="dipti-quick-replies">
            <p class="quick-reply-title">Common Sourcing Questions:</p>
            <button class="dipti-quick-reply-btn" type="button" data-question="What is the MOQ for custom printing?">
              💬 What is the MOQ for custom logo printing?
            </button>
            <button class="dipti-quick-reply-btn" type="button" data-question="Tell me about Airlaid vs cloth Linen.">
              💬 Airlaid Napkins vs Cloth Linen?
            </button>
            <button class="dipti-quick-reply-btn" type="button" data-question="How do I get a free sample kit?">
              💬 How can I request a free physical sample?
            </button>
          </div>
        </div>
        


        <form class="dipti-chat-input-area" id="dipti-input-form">
          <input type="text" id="dipti-user-input" placeholder="Ask Saksham about sizes, custom prints..." autocomplete="off" required />
          <button type="submit" id="dipti-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(container);
  return container;
};

const buildChatbotTrigger = () => {
  const button = document.createElement('button');
  button.className = 'dipti-chatbot-trigger';
  button.type = 'button';
  button.setAttribute('aria-label', 'Have a question?');
  button.innerHTML = `
    <span class="dipti-trigger-text">Have a question?</span>
    <div class="dipti-trigger-icon-wrap">
      <div class="dipti-trigger-logo">
        <img src="/saksham-avatar.png" alt="Saksham Avatar" />
      </div>
      <div class="dipti-trigger-close">&times;</div>
    </div>
  `;
  document.body.appendChild(button);
  return button;
};

const SAKSHAM_SYSTEM_INSTRUCTION = `
Here is the verified information about SILQUE that you must use to answer questions:

1. COMPANY OVERVIEW & CONTACTS:
- Brand Name: SILQUE TISSUES (or SILQUE).
- Operations: Manufacturer and wholesale supplier of dry-laid airlaid nonwoven cellulose napkins.
- Bangalore Office: 15, 3rd Cross, 80 Feet Road, Koramangala 6th Block, Bengaluru - 560095.
- Email: info@silquetissues.com
- Phone / WhatsApp: +91 91224 28064 (provide this for direct quotes or sample requests).
- GSTIN: 29AFXFS1361J1Z8

2. WHAT IS AIRLAID MATERIAL?
- Material: 100% virgin cellulose wood pulp fibers distributed using air loops (dry-laid process) instead of water.
- Experience: It feels like linen fabric, has heavy drape, holds folds beautifully, and is highly absorbent and lint-free.
- Linen vs. Airlaid: Airlaid is single-use, providing maximum hygiene while eliminating hotel laundry overheads (washing, ironing, storage, replenishment, and inventory loss).
- Tissue vs. Airlaid: Airlaid is 60-75 GSM, significantly thicker and stronger than thin multi-ply paper tissues. One airlaid napkin lasts the entire meal.
- Water efficiency: Uses up to 95% less water in production than traditional paper mills. Fully biodegradable and compostable.

3. PRODUCT FORMATS & SPECIFICATIONS:
- 8x8 Cocktail Napkin: Open size 8"x8" (20cm x 20cm). 1/4 fold. Ideal for beverage service, welcome drinks, lounge bars, cafes, receptions.
- 16x16 Dinner Napkin: Open size 16"x16" (40cm x 40cm). 1/4 fold or 1/8 fold. Ideal for formal dining, banquets, wedding covers.
- Pocket Cutlery Napkin: Open size 16"x16" (40cm x 40cm), pre-folded in a 1/8 book fold with a built-in sleeve to hold cutlery. Speeds up table setting times by 50%. Ideal for banquets, buffets, caterers, and room service.

4. COLORS & CUSTOMIZATION:
- Base Colors: White, Ivory, Champagne, Charcoal, Navy, Sage, Burgundy, Blush. Custom color matching is available for large orders.
- Custom Printing: We print client logos using:
  * Flexo Printing (up to 2 colors using food-safe, non-bleeding inks).
  * Metallic Hotfoil Stamping (gold/silver details for premium events).
  * Embossing/Debossing (blind texture presses).
- Minimum Order Quantity (MOQ) for custom logo printing: 10,000 Pcs per design.
- Lower tiers available for unprinted stock.

5. LEAD TIMELINE & DELIVERY:
- Production Lead Time: 7 to 10 days from design layout approval.
- Warehouse: Koramangala, Bangalore.
- Delivery: Direct door-to-door delivery across Bangalore. We ship to major Indian hubs.

6. SAMPLE KITS:
- Free physical sample packs are available for hospitality buyers in India.
- To request samples, they should provide their Name, Company, Email, Phone, and Delivery Address. They can do this by using the "Request Sample" button on the site, emailing info@silquetissues.com, or WhatsApping +91 91224 28064.

BEHAVIOR GUIDELINES:
- You must ONLY respond in short, clear bullet points (using simple hyphens like "-"). Never write paragraphs.
- Keep answers extremely concise and to-the-point (1-3 bullet points max).
- Do NOT use any markdown formatting like bolding (no asterisks like "**" or "###"). Keep all text plain, simple, and clean.
- Act like a professional customer service executive on WhatsApp, not an AI search engine. Do not write filler intros, general summaries, or unsolicited background information.
- Focus strictly on answering the specific question asked. If a question is off-topic, politely guide them back to SILQUE's sourcing.
- Provide our contact info (WhatsApp: +91 91224 28064, Email: info@silquetissues.com) for pricing, orders, and custom quotes.
- Mention the free sample kit only when relevant to quality or sourcing questions.
- Never make up information. If unknown, ask them to contact sales.
`;

const showGreetingTooltip = (trigger) => {
  if (localStorage.getItem('silque_chat_interacted')) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'dipti-greeting-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-body">Hi! I'm Saksham. Have a sourcing question? 👋</div>
    <div class="tooltip-arrow"></div>
  `;
  document.body.appendChild(tooltip);

  const positionTooltip = () => {
    const rect = trigger.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.bottom = `${window.innerHeight - rect.top + 12}px`;
  };

  // Delay fade-in
  setTimeout(() => {
    tooltip.classList.add('visible');
    positionTooltip();
  }, 4000);

  window.addEventListener('resize', positionTooltip);

  const dismissTooltip = () => {
    tooltip.classList.remove('visible');
    setTimeout(() => tooltip.remove(), 300);
    window.removeEventListener('scroll', dismissTooltip);
    window.removeEventListener('resize', positionTooltip);
  };

  window.addEventListener('scroll', dismissTooltip, { once: true });
  trigger.addEventListener('click', () => {
    localStorage.setItem('silque_chat_interacted', 'true');
    dismissTooltip();
  }, { once: true });
};

const initSakshamChatbot = () => {
  if (window.location.pathname.includes('/contact')) return;

  const trigger = buildChatbotTrigger();
  const widget = buildChatbotDipti();
  
  const menuView = widget.querySelector('#dipti-menu-view');
  const chatView = widget.querySelector('#dipti-chat-view');
  
  const optAiBtn = widget.querySelector('#dipti-opt-ai');
  const optQuoteBtn = widget.querySelector('#dipti-opt-quote');
  const backBtn = widget.querySelector('#dipti-back-btn');
  const closeBtns = widget.querySelectorAll('.dipti-chat-close');
  
  const inputForm = widget.querySelector('#dipti-input-form');
  const userInput = widget.querySelector('#dipti-user-input');
  const messagesContainer = widget.querySelector('#dipti-messages');
  const quickRepliesContainer = widget.querySelector('#dipti-quick-replies');

  let chatHistory = [];

  // Local response cache helpers
  const getCachedResponse = (query) => {
    try {
      const cache = JSON.parse(localStorage.getItem('silque_response_cache')) || {};
      return cache[query.toLowerCase().trim()];
    } catch (e) {
      return null;
    }
  };

  const saveCachedResponse = (query, answer) => {
    try {
      const cache = JSON.parse(localStorage.getItem('silque_response_cache')) || {};
      cache[query.toLowerCase().trim()] = answer;
      localStorage.setItem('silque_response_cache', JSON.stringify(cache));
    } catch (e) {}
  };

  // Trigger greeting tooltip after page load
  showGreetingTooltip(trigger);

  // Auto-expand teaser "Have a question?" on load, then collapse after 3 seconds
  setTimeout(() => {
    if (!widget.classList.contains('dipti-open')) {
      trigger.classList.add('dipti-expand-teaser');
      setTimeout(() => {
        trigger.classList.remove('dipti-expand-teaser');
      }, 3000);
    }
  }, 1200);

  const addMessage = (sender, text) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `dipti-message ${sender}`;
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const resetWidgetViews = () => {
    menuView.style.display = 'flex';
    chatView.style.display = 'none';
    widget.classList.remove('dipti-chat-mode');
    
    menuView.classList.remove('dipti-animate');
    void menuView.offsetWidth; // force reflow
    menuView.classList.add('dipti-animate');
    
    if (chatHistory.length === 0 && quickRepliesContainer) {
      quickRepliesContainer.style.display = 'flex';
    }
  };

  const toggleChat = () => {
    const isOpen = widget.classList.contains('dipti-open');
    if (isOpen) {
      widget.classList.remove('dipti-open');
      trigger.classList.remove('is-active');
    } else {
      if (typeof closeQuoteModal === 'function' && quoteModal && quoteModal.classList.contains('is-open')) {
        closeQuoteModal({ restoreFocus: false });
      }
      widget.classList.add('dipti-open');
      trigger.classList.add('is-active');
      resetWidgetViews();
    }
  };

  trigger.addEventListener('click', toggleChat);
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', toggleChat);
  });

  optAiBtn.addEventListener('click', () => {
    menuView.style.display = 'none';
    chatView.style.display = 'flex';
    widget.classList.add('dipti-chat-mode');
    userInput.focus();
  });

  optQuoteBtn.addEventListener('click', () => {
    toggleChat();
    if (typeof openQuoteModal === 'function') {
      openQuoteModal(optQuoteBtn);
    }
  });

  backBtn.addEventListener('click', resetWidgetViews);

  const quickReplyBtns = widget.querySelectorAll('.dipti-quick-reply-btn');
  quickReplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      if (question) {
        userInput.value = question;
        if (quickRepliesContainer) {
          quickRepliesContainer.style.display = 'none';
        }
        inputForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  inputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    if (quickRepliesContainer) {
      quickRepliesContainer.style.display = 'none';
    }

    addMessage('user', query);
    userInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'dipti-message assistant typing-indicator-msg';
    typingDiv.innerHTML = `<div class="message-content"><em>Saksham is typing...</em></div>`;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatHistory.push({ role: 'user', parts: [{ text: query }] });
    if (chatHistory.length > 4) {
      chatHistory = chatHistory.slice(-4);
    }

    // CHECK CACHE
    const cached = getCachedResponse(query);
    if (cached) {
      setTimeout(() => {
        typingDiv.remove();
        addMessage('assistant', cached);
        chatHistory.push({ role: 'model', parts: [{ text: cached }] });
        if (chatHistory.length > 4) {
          chatHistory = chatHistory.slice(-4);
        }
      }, 450);
      return;
    }

    try {
      const decodedKey = atob('QUl6YVN5QThSTjZMX0VUZHJMQmNNQWJ3dWN6X0hBS1p2eG02QXdYSDg2Z05ma3Vfb2lEaDcwdw==');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${decodedKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatHistory,
          system_instruction: { parts: [{ text: SAKSHAM_SYSTEM_INSTRUCTION }] },
          generationConfig: {
            maxOutputTokens: 300
          }
        })
      });

      typingDiv.remove();

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const resData = await response.json();
      let answer = resData.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate an answer. Please contact info@silquetissues.com.';

      const cleanAnswer = (text) => {
        let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '-');
        let rawLines = cleaned.split('\n');
        let points = [];
        
        rawLines.forEach(line => {
          let trimmed = line.trim();
          if (!trimmed) return;
          
          let content = trimmed.replace(/^[-*•\d\.\:\s]+/, '').trim();
          if (!content) return;
          
          const lower = content.toLowerCase();
          if (lower.startsWith('here is') || lower.startsWith('here are') || lower.startsWith('sure,') || lower.startsWith('certainly') || content.endsWith(':')) {
            return;
          }
          
          points.push(`- ${content}`);
        });
        
        if (points.length === 0) {
          let sentences = cleaned.split(/(?<=[.!?])\s+/);
          sentences.forEach(s => {
            let trimmed = s.trim();
            if (!trimmed) return;
            let content = trimmed.replace(/^[-*•\d\.\:\s]+/, '').trim();
            if (content) {
              points.push(`- ${content}`);
            }
          });
        }
        
        if (points.length > 3) {
          points = points.slice(0, 3);
        }
        
        return points.join('\n');
      };

      const formattedAnswer = cleanAnswer(answer);

      addMessage('assistant', formattedAnswer);
      chatHistory.push({ role: 'model', parts: [{ text: formattedAnswer }] });
      if (chatHistory.length > 4) {
        chatHistory = chatHistory.slice(-4);
      }

      // SAVE TO CACHE
      saveCachedResponse(query, formattedAnswer);

    } catch (err) {
      console.error(err);
      typingDiv.remove();
      addMessage('assistant', '❌ <em>Sorry, I encountered an error. Please try again or contact us directly on WhatsApp.</em>');
    }
  });
};

initSakshamChatbot();
