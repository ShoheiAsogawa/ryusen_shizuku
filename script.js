const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navBackdrop = document.querySelector(".nav-backdrop");
const navLinks = document.querySelectorAll(".site-nav a");
const revealTargets = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const parallaxTargets = document.querySelectorAll(".about-image img, .product-still img, .story-bg");
const heroSection = document.querySelector(".hero");

function setNavOpen(isOpen) {
  body.classList.toggle("nav-open", isOpen);
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
}

navToggle?.addEventListener("click", () => {
  setNavOpen(!body.classList.contains("nav-open"));
});

navBackdrop?.addEventListener("click", () => {
  setNavOpen(false);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && body.classList.contains("nav-open")) {
    setNavOpen(false);
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setNavOpen(false);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: "0px 0px 12% 0px" });

revealTargets.forEach((target) => revealObserver.observe(target));

requestAnimationFrame(() => {
  revealTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.08 && rect.bottom > 0) {
      target.classList.add("is-visible");
    }
  });
});

let ticking = false;

function updateDrops() {
  parallaxTargets.forEach((target, index) => {
    const rect = target.getBoundingClientRect();
    const local = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, local));
    const shift = Math.round((clamped - .5) * (index === 2 ? 32 : 20));
    target.style.setProperty("--parallax-y", `${shift}px`);
  });

  if (heroSection) {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    body.classList.toggle("header-on-light", heroBottom < 140);
  }

  ticking = false;
}

function requestDropUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateDrops);
}

window.addEventListener("scroll", requestDropUpdate, { passive: true });
window.addEventListener("resize", requestDropUpdate);
updateDrops();

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  const label = button.textContent;
  button.textContent = "送信内容を受け付けました";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = label;
    button.disabled = false;
    contactForm.reset();
  }, 1800);
});
