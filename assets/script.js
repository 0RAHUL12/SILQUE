const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const animatedItems = document.querySelectorAll("[data-animate]");
const parallaxItems = document.querySelectorAll(".hero-stage, .detail-image, .category-hook");
const WHATSAPP_NUMBER = "+91 9122428064";
const WHATSAPP_MESSAGE = "Hello SILQUE, I am interested in your airlaid napkins. Please share product details, colours, samples, and pricing.";
const whatsappUrl = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : "";

menuToggle?.addEventListener("click", () => {
  header.classList.toggle("menu-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}

whatsappLinks.forEach((link) => {
  if (whatsappUrl) {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  }

  link.addEventListener("click", (event) => {
    if (!WHATSAPP_NUMBER) {
      event.preventDefault();
      return;
    }
  });
});

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach((item, index) => {
      const speed = index === 0 ? 0.035 : 0.018;
      item.style.setProperty("--scroll-shift", `${scrollY * speed}px`);
    });
  },
  { passive: true }
);
