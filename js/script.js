const fadeSections = document.querySelectorAll(".fade-section");
const scrollSections = document.querySelectorAll(".scroll-section:not(.pillar-section):not(.brands-section):not(.familiar-section):not(.proof-section)");
const cards = document.querySelectorAll(".card");
const reveals = document.querySelectorAll(".reveal");
const supportsFineHoverPointer = () => !window.matchMedia || window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const initializeCursorDot = () => {
const dot = document.querySelector(".cursor-dot");

if (!dot) {
return;
}

if (!supportsFineHoverPointer()) {
dot.classList.remove("is-visible", "visible", "is-hovering", "hovering");
return;
}

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let mouseX = x;
let mouseY = y;
let scale = 1;

const render = () => {
x += (mouseX - x) * 0.12;
y += (mouseY - y) * 0.12;
dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
window.requestAnimationFrame(render);
};

dot.classList.add("is-visible");

window.addEventListener("mousemove", (event) => {
mouseX = event.clientX;
mouseY = event.clientY;
dot.classList.add("is-visible");
}, { passive: true });

document.querySelectorAll("a, button").forEach((element) => {
element.addEventListener("mouseenter", () => {
scale = 1.8;
dot.classList.add("is-hovering");
});

element.addEventListener("mouseleave", () => {
scale = 1;
dot.classList.remove("is-hovering");
});
});

render();
};

if ("IntersectionObserver" in window) {
const cardObserver = new IntersectionObserver((entries, observer) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) {
return;
}
const index = Number(entry.target.dataset.cardIndex || 0);

window.setTimeout(() => {
entry.target.classList.add("show");
}, index * 90);

observer.unobserve(entry.target);
});
}, {
threshold: 0.2,
rootMargin: "0px 0px -30px 0px"
});

cards.forEach((card, index) => {
card.dataset.cardIndex = index;
cardObserver.observe(card);
});
} else {
cards.forEach((card) => {
card.classList.add("show");
});
}

const revealHero = () => {
reveals.forEach((item, index) => {
window.setTimeout(() => {
item.classList.add("is-visible");
}, 140 * index);
});
};

const animateStorySection = () => {
const slidesSection = document.querySelector(".story-slides");

if (!slidesSection) {
return;
}

const track = slidesSection.querySelector(".story-slides-track");
const slides = Array.from(slidesSection.querySelectorAll(".story-slide"));
const dots = Array.from(slidesSection.querySelectorAll(".story-slides-dot"));
const glowTarget = slidesSection.querySelector(".story-glow");
const prevButton = slidesSection.querySelector(".story-slides-prev");
const nextButton = slidesSection.querySelector(".story-slides-next");
const currentNode = slidesSection.querySelector(".story-slides-current");
const totalNode = slidesSection.querySelector(".story-slides-total");
const progressBar = slidesSection.querySelector(".story-slides-progress-bar");
const ambientTargets = slidesSection.querySelectorAll(".story-orb");
let activeIndex = 0;

if (!track || !slides.length) {
return;
}

if (totalNode) {
totalNode.textContent = String(slides.length).padStart(2, "0");
}

const setActiveSlide = (index) => {
track.style.transform = `translateX(-${index * 100}%)`;

slides.forEach((slide, slideIndex) => {
slide.classList.toggle("is-active", slideIndex === index);
});

dots.forEach((dot, dotIndex) => {
dot.classList.toggle("is-active", dotIndex === index);
});

if (glowTarget) {
glowTarget.style.textShadow = index === 2 ? "0 0 20px rgba(212, 175, 55, 0.45), 0 0 42px rgba(212, 175, 55, 0.2)" : "0 0 0 rgba(212, 175, 55, 0)";
}

if (currentNode) {
currentNode.textContent = String(index + 1).padStart(2, "0");
}

if (progressBar) {
progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
}

if (prevButton) {
prevButton.disabled = index === 0;
}

if (nextButton) {
nextButton.disabled = index === slides.length - 1;
}

if (window.gsap) {
const activeSlide = slides[index];
const activeParagraph = activeSlide ? activeSlide.querySelector("p") : null;

if (activeParagraph) {
window.gsap.killTweensOf(activeParagraph);
window.gsap.fromTo(activeParagraph, {
autoAlpha: 0,
y: 54,
scale: 0.98
}, {
autoAlpha: 1,
y: 0,
scale: 1,
duration: 0.9,
ease: "power3.out"
});
}

if (progressBar) {
window.gsap.to(progressBar, {
boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
duration: 0.35,
repeat: 1,
yoyo: true,
ease: "power1.inOut"
});
}
}

if (window.anime && dots[index]) {
window.anime.remove(dots[index]);
window.anime({
targets: dots[index],
scale: [1, 1.18, 1],
duration: 700,
easing: "easeInOutSine"
});
}
};

const goToSlide = (index) => {
activeIndex = Math.max(0, Math.min(slides.length - 1, index));
setActiveSlide(activeIndex);
};

setActiveSlide(activeIndex);

if (window.gsap) {
const introNodes = [
slidesSection.querySelector(".story-slides-meta"),
slidesSection.querySelector(".story-slides-controls"),
slidesSection.querySelector(".story-slides-nav"),
slidesSection.querySelector(".story-slides-progress")
].filter(Boolean);

window.gsap.set(introNodes, {
autoAlpha: 0,
y: 20
});

window.gsap.timeline({
defaults: {
duration: 0.9,
ease: "power3.out"
}
})
.fromTo(slidesSection, {
"--story-slides-scale": 1.04
}, {
"--story-slides-scale": 1,
duration: 1.4,
ease: "power2.out"
})
.to(introNodes, {
autoAlpha: 1,
y: 0,
stagger: 0.08
}, "-=0.95");
}

if (window.anime && ambientTargets.length) {
window.anime({
targets: ambientTargets,
translateY: (target, index) => [0, index % 2 === 0 ? -16 : 18],
translateX: (target, index) => [0, index === 1 ? -12 : 10],
scale: (target, index) => [1, index === 1 ? 1.08 : 1.05],
opacity: (target, index) => [0.24, index === 1 ? 0.42 : 0.34],
duration: (target, index) => 4200 + (index * 900),
delay: (target, index) => index * 140,
direction: "alternate",
loop: true,
easing: "easeInOutSine"
});
}

if (prevButton) {
prevButton.addEventListener("click", () => {
goToSlide(activeIndex - 1);
});
}

if (nextButton) {
nextButton.addEventListener("click", () => {
goToSlide(activeIndex + 1);
});
}
};

const animatePremiumHero = () => {
const hero = document.querySelector(".premium-hero");

if (!hero) {
return;
}

const animatedItems = hero.querySelectorAll(".hero-copy, .hero-panel");

if (!animatedItems.length) {
return;
}

if (!window.gsap) {
animatedItems.forEach((item) => {
item.style.opacity = "1";
item.style.transform = "translateY(0)";
});
return;
}

window.gsap.timeline({
defaults: {
duration: 0.9,
ease: "power3.out"
}
})
.to(hero.querySelector(".hero-copy"), {
autoAlpha: 1,
y: 0
})
.to(hero.querySelector(".hero-panel"), {
autoAlpha: 1,
y: 0
}, "-=0.55");
};

const animateTeamSection = () => {
const section = document.querySelector(".team-preview-section");

if (!section) {
return;
}

const header = section.querySelector(".team-preview-header");
const cards = section.querySelectorAll(".team-story, .team-story-link");

if (!window.gsap) {
if (header) {
header.style.opacity = "1";
header.style.transform = "translateY(0)";
}

cards.forEach((card) => {
card.style.opacity = "1";
card.style.transform = "translateY(0)";
});
return;
}

const timeline = window.gsap.timeline({
defaults: {
duration: 0.9,
ease: "power3.out"
}
});

if (header) {
timeline.to(header, {
autoAlpha: 1,
y: 0
});
}

if (cards.length) {
timeline.to(cards, {
autoAlpha: 1,
y: 0,
stagger: 0.12
}, header ? "-=0.45" : 0);
}
};

const animateBrandsSection = () => {
const section = document.querySelector(".brands-section");

if (!section) {
return;
}

const heading = section.querySelector(".brands-heading");
const logoPanel = section.querySelector(".brand-logos-figure");

if (!window.gsap) {
if (heading) {
heading.style.opacity = "1";
heading.style.transform = "translateY(0)";
}

if (logoPanel) {
logoPanel.style.opacity = "1";
logoPanel.style.transform = "translateY(0) scale(1)";
}
return;
}

const timeline = window.gsap.timeline({
scrollTrigger: window.ScrollTrigger ? {
trigger: section,
start: "top 80%",
once: true
} : undefined,
defaults: {
duration: 0.9,
ease: "power3.out"
}
});

if (heading) {
timeline.to(heading, {
autoAlpha: 1,
y: 0
});
}

if (logoPanel) {
timeline.to(logoPanel, {
autoAlpha: 1,
y: 0,
scale: 1
}, heading ? "-=0.45" : 0);
}
};

const animateProofSection = () => {
const section = document.querySelector(".proof-section");

if (!section) {
return;
}

const heading = section.querySelector(".section-heading");
const chips = section.querySelectorAll(".proof-chip");

if (!window.gsap) {
if (heading) {
heading.style.opacity = "1";
heading.style.transform = "translateY(0)";
}

chips.forEach((chip) => {
chip.style.opacity = "1";
chip.style.transform = "translateY(0) scale(1)";
});
return;
}

if (window.ScrollTrigger) {
window.gsap.registerPlugin(window.ScrollTrigger);
}

const timeline = window.gsap.timeline({
scrollTrigger: window.ScrollTrigger ? {
trigger: section,
start: "top 80%",
once: true
} : undefined,
defaults: {
duration: 0.85,
ease: "power3.out"
}
});

if (heading) {
timeline.to(heading, {
autoAlpha: 1,
y: 0
});
}

if (chips.length) {
timeline.to(chips, {
autoAlpha: 1,
y: 0,
scale: 1,
stagger: {
each: 0.1,
from: "center"
}
}, heading ? "-=0.4" : 0);
}
};

const initializeFoundersSection = () => {
const elements = document.querySelectorAll(".js-founders-reveal");

if (!elements.length) {
return;
}

if (!("IntersectionObserver" in window)) {
elements.forEach((element) => element.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) {
return;
}

entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
});
}, {
threshold: 0.1
});

elements.forEach((element) => observer.observe(element));
};

const animateFooter = () => {
const footer = document.querySelector(".site-footer");

if (!footer) {
return;
}

const columns = footer.querySelectorAll(".footer-container > *");
const cta = footer.querySelector(".footer-link-inline");
const socials = footer.querySelectorAll(".footer-socials img");
const bottom = footer.querySelector(".footer-bottom");

if (!window.gsap) {
return;
}

if (window.ScrollTrigger) {
window.gsap.registerPlugin(window.ScrollTrigger);
}

const timeline = window.gsap.timeline({
scrollTrigger: window.ScrollTrigger ? {
trigger: footer,
start: "top 88%",
once: true
} : undefined,
defaults: {
duration: 0.9,
ease: "power3.out"
}
});

if (columns.length) {
timeline.from(columns, {
autoAlpha: 0,
y: 42,
stagger: 0.12
});
}

if (cta) {
timeline.from(cta, {
autoAlpha: 0,
x: -18
}, columns.length ? "-=0.45" : 0);
}

if (socials.length) {
timeline.from(socials, {
autoAlpha: 0,
scale: 0.78,
rotation: -8,
transformOrigin: "50% 50%",
stagger: 0.08
}, "-=0.5");
}

if (bottom) {
timeline.from(bottom, {
autoAlpha: 0,
y: 22
}, "-=0.45");
}
};

const animateFamiliarSection = () => {
const section = document.querySelector(".familiar-section");

if (!section) {
return;
}

const header = section.querySelector(".familiar-header");
const cards = section.querySelectorAll(".familiar-card");
const closing = section.querySelector(".familiar-why");

if (!window.gsap) {
[header, closing].forEach((item) => {
if (item) {
item.style.opacity = "1";
item.style.transform = "translateY(0)";
}
});

cards.forEach((card) => {
card.style.opacity = "1";
card.style.transform = "translateY(0)";
});
return;
}

if (window.ScrollTrigger) {
window.gsap.registerPlugin(window.ScrollTrigger);
}

window.gsap.set([header, closing], {
autoAlpha: 0,
y: 28
});

const timeline = window.gsap.timeline({
scrollTrigger: window.ScrollTrigger ? {
trigger: section,
start: "top 78%",
once: true
} : undefined,
defaults: {
duration: 0.85,
ease: "power3.out"
}
});

if (header) {
timeline.to(header, {
autoAlpha: 1,
y: 0
});
}

if (cards.length) {
timeline.to(cards, {
autoAlpha: 1,
y: 0,
stagger: 0.08
}, "-=0.38");
}

if (closing) {
timeline.to(closing, {
autoAlpha: 1,
y: 0
}, "-=0.3");
}
};

const scrambleText = (element, finalText, delay = 0) => {
if (!element || !window.gsap) {
return;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const revealedText = finalText.replace(/\n/g, " ");
let frame = 0;

window.gsap.delayedCall(delay, () => {
window.gsap.to(element, {
opacity: 1,
duration: 0.2,
onStart: () => {
const scrambleStep = () => {
const nextText = finalText
.split("")
.map((character, index) => {
if (character === "\n") {
return "\n";
}

if (index < frame) {
return finalText[index];
}

return chars[Math.floor(Math.random() * chars.length)];
})
.join("");

element.textContent = nextText;
frame += 0.45;

if (frame < revealedText.length) {
window.requestAnimationFrame(scrambleStep);
return;
}

element.textContent = finalText;
};

scrambleStep();
}
});
});
};

const animateServicesPage = () => {
const page = document.querySelector(".services-page");

if (!page) {
return;
}

const scrambleLines = page.querySelectorAll(".services-scramble");
const serviceCards = page.querySelectorAll(".service-flip-card");

if (!window.gsap) {
serviceCards.forEach((card) => {
const inner = card.querySelector(".service-flip-inner");

if (inner) {
inner.style.transform = "rotateY(0deg)";
}
});
return;
}

if (window.ScrollTrigger) {
window.gsap.registerPlugin(window.ScrollTrigger);
}

if (scrambleLines.length) {
scrambleLines.forEach((line, index) => {
const targetText = line.textContent ? line.textContent.trim() : "";
line.textContent = "";
line.style.opacity = "0";

if (window.ScrollTrigger) {
window.ScrollTrigger.create({
trigger: line,
start: "top 82%",
once: true,
onEnter: () => {
scrambleText(line, targetText, index * 0.08);
}
});
return;
}

scrambleText(line, targetText, index * 0.25);
});
}

serviceCards.forEach((card, index) => {
const inner = card.querySelector(".service-flip-inner");

if (!inner) {
return;
}

window.gsap.set(inner, {
rotationY: -90,
transformPerspective: 1200,
transformOrigin: "50% 50%"
});

window.gsap.to(inner, {
rotationY: 0,
duration: 0.95,
ease: "power3.out",
delay: index * 0.03,
scrollTrigger: window.ScrollTrigger ? {
trigger: card,
start: "top 85%",
toggleActions: "play none none none",
once: true
} : undefined
});
});
};

const initializeScrollSections = () => {
if (!scrollSections.length) {
return;
}

if (!window.gsap || !window.ScrollTrigger) {
fadeSections.forEach((section) => {
section.classList.add("visible");
});
return;
}

window.gsap.registerPlugin(window.ScrollTrigger);

scrollSections.forEach((section) => {
window.gsap.from(section, {
autoAlpha: 0,
y: 56,
duration: 0.95,
ease: "power3.out",
scrollTrigger: {
trigger: section,
start: "top 82%",
toggleActions: "play none none none",
once: true
}
});
});
};

const initializeLotties = () => {
if (!window.lottie) {
return;
}

const lottieNodes = document.querySelectorAll(".service-lottie[data-lottie-path]");

lottieNodes.forEach((node) => {
if (node.dataset.lottieLoaded === "true") {
return;
}

window.lottie.loadAnimation({
container: node,
renderer: "svg",
loop: true,
autoplay: true,
path: node.dataset.lottiePath
});

node.dataset.lottieLoaded = "true";
});
};

const initializeInlineSvg = async () => {
const inlineSvgNodes = document.querySelectorAll("[data-inline-svg]");

for (const node of inlineSvgNodes) {
if (node.dataset.inlineSvgLoaded === "true") {
continue;
}

const source = node.dataset.inlineSvg;

if (!source) {
continue;
}

try {
const response = await window.fetch(source);

if (!response.ok) {
continue;
}

const svgMarkup = await response.text();
node.innerHTML = svgMarkup;
node.dataset.inlineSvgLoaded = "true";
} catch (error) {
console.error("Failed to inline SVG:", source, error);
}
}
};

const initializeContactForm = () => {
if (document.body.classList.contains("contact-page")) {
return;
}

const form = document.querySelector("[data-contact-form]");

if (!form) {
return;
}

const submitButton = form.querySelector("[data-submit-button]");
const statusNode = form.querySelector("[data-form-status]");
const mobileInput = form.querySelector("#contact-mobile");
const emailInput = form.querySelector("#contact-email");
const originalButtonContent = submitButton ? submitButton.innerHTML : "Send Message";
const getSubmitEndpoint = () => {
if (form.dataset.submitUrl) {
return form.dataset.submitUrl;
}

if (window.HAKAYAA_SUBMIT_ENDPOINT) {
return window.HAKAYAA_SUBMIT_ENDPOINT;
}

const isLocalFrontend = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
return isLocalFrontend && window.location.port !== "3000" ? "http://localhost:3000/submit" : "/submit";
};
const submitEndpoint = getSubmitEndpoint();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let isSubmitting = false;

const setStatus = (message, type) => {
if (!statusNode) {
return;
}

statusNode.textContent = message;
statusNode.classList.remove("is-success", "is-error");

if (type) {
statusNode.classList.add(type);
}
};

form.addEventListener("submit", async (event) => {
event.preventDefault();

if (isSubmitting) {
return;
}

const formData = new FormData(form);
const payload = {
name: String(formData.get("name") || "").trim(),
email: String(formData.get("email") || "").trim(),
phone: String(formData.get("phone") || formData.get("mobile") || "").replace(/\D/g, ""),
message: String(formData.get("message") || "").trim()
};

if (!payload.name || !payload.email || !payload.message) {
setStatus("Please fill in your name, email, and message.", "is-error");
return;
}

if (!EMAIL_REGEX.test(payload.email)) {
setStatus("Please enter a valid email address.", "is-error");

if (emailInput) {
emailInput.focus();
}

return;
}

if (payload.phone && !/^\d{10,15}$/.test(payload.phone)) {
setStatus("Mobile number must be between 10 and 15 digits.", "is-error");

if (mobileInput) {
mobileInput.focus();
}

return;
}

const controller = new AbortController();
const timeoutId = window.setTimeout(() => {
controller.abort();
}, 60000);

try {
isSubmitting = true;

if (submitButton) {
submitButton.disabled = true;
submitButton.innerHTML = "<span>Sending...</span>";
}

setStatus("Submitting your message...", "");

console.log(`[contact-form] POST ${submitEndpoint}`);

const response = await window.fetch(submitEndpoint, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload),
signal: controller.signal
});

const result = await response.json().catch(() => ({}));

if (!response.ok || !result.success) {
throw new Error(result.message || "Something went wrong while submitting the form.");
}

form.reset();
setStatus("Thanks. Your message has been sent successfully.", "is-success");
} catch (error) {
console.error("[contact-form] Submission failed", error);

if (error.name === "AbortError") {
setStatus("The message is taking longer than expected. Please check your sheet before trying again.", "is-error");
} else {
setStatus(error.message || "Unable to submit the form right now. Please try again.", "is-error");
}
} finally {
window.clearTimeout(timeoutId);
isSubmitting = false;

if (submitButton) {
submitButton.disabled = false;
submitButton.innerHTML = originalButtonContent;
}
}
});
};

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", () => {
initializeCursorDot();
revealHero();
animateStorySection();
animatePremiumHero();
animateTeamSection();
animateProofSection();
initializeFoundersSection();
animateBrandsSection();
animateFooter();
animateFamiliarSection();
animateServicesPage();
initializeScrollSections();
initializeLotties();
initializeInlineSvg();
initializeContactForm();
});
} else {
initializeCursorDot();
revealHero();
animateStorySection();
animatePremiumHero();
animateTeamSection();
animateProofSection();
initializeFoundersSection();
animateBrandsSection();
animateFooter();
animateFamiliarSection();
animateServicesPage();
initializeScrollSections();
initializeLotties();
initializeInlineSvg();
initializeContactForm();
}

const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
let lastScrollY = window.scrollY;

const closeMobileNav = () => {
if (!navbar || !navToggle || !navLinks) {
return;
}

navbar.classList.remove("nav-open");
navToggle.setAttribute("aria-expanded", "false");
navToggle.setAttribute("aria-label", "Open navigation");
document.body.classList.remove("nav-open");
};

const openMobileNav = () => {
if (!navbar || !navToggle || !navLinks) {
return;
}

navbar.classList.add("nav-open");
navToggle.setAttribute("aria-expanded", "true");
navToggle.setAttribute("aria-label", "Close navigation");
document.body.classList.add("nav-open");
};

const updateNavbarVisibility = () => {
if (!navbar) {
return;
}

if (navbar.classList.contains("nav-open")) {
navbar.classList.remove("navbar-hidden");
lastScrollY = window.scrollY;
return;
}

const currentScrollY = window.scrollY;
const isNearTop = currentScrollY < 24;

if (isNearTop || currentScrollY < lastScrollY) {
navbar.classList.remove("navbar-hidden");
} else if (currentScrollY > lastScrollY) {
navbar.classList.add("navbar-hidden");
}

lastScrollY = currentScrollY;
};

window.addEventListener("scroll", updateNavbarVisibility, { passive: true });
updateNavbarVisibility();

if (navToggle && navLinks && navbar && navbar.dataset.mobileNavReady !== "true") {
navbar.dataset.mobileNavReady = "true";
navToggle.addEventListener("click", () => {
if (navbar.classList.contains("nav-open")) {
closeMobileNav();
return;
}

openMobileNav();
});

navLinks.querySelectorAll("a").forEach((link) => {
link.addEventListener("click", () => {
closeMobileNav();
});
});

window.addEventListener("resize", () => {
if (window.innerWidth > 900) {
closeMobileNav();
}
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeMobileNav();
}
});
}

const initializeHakayaaHeroClean = () => {
document.querySelectorAll(".s1-word").forEach((word, index) => {
window.setTimeout(() => {
word.style.transition = "opacity 0.6s,transform 0.6s";
word.style.opacity = "1";
word.style.transform = "translateY(0)";
}, 1600 + (index * 160));
});

if (!("IntersectionObserver" in window)) {
return;
}

const storyObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("vis");
}
});
}, {
threshold: 0.25
});

["s2tag", "l1", "l2", "l3", "l4", "l5", "s2grid"].forEach((id, index) => {
const element = document.getElementById(id);

if (!element) {
return;
}

element.style.transitionDelay = `${index * 0.1}s`;
storyObserver.observe(element);
});

["s3q", "s3h", "s3b", "s3cta", "s3r"].forEach((id, index) => {
const element = document.getElementById(id);

if (!element) {
return;
}

element.style.transitionDelay = `${index * 0.15}s`;
storyObserver.observe(element);
});
};

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initializeHakayaaHeroClean);
} else {
initializeHakayaaHeroClean();
}
// // SERVICES ECOSYSTEM PAGE START

// // Services page ecosystem interactions
// const initializeServicesEcosystemPage = () => {
//   const page = document.querySelector(".services-page");
//   if (!page || page.dataset.servicesEcosystemReady === "true") {
//     return;
//   }
//   page.dataset.servicesEcosystemReady = "true";

//   document.querySelectorAll(".hero-pill").forEach((pill) => {
//     pill.addEventListener("click", (event) => {
//       const selector = pill.getAttribute("href");
//       const target = selector ? document.querySelector(selector) : null;
//       if (!target) {
//         return;
//       }
//       event.preventDefault();
//       target.scrollIntoView({ behavior: "smooth", block: "start" });
//     });
//   });

//   const reveal = (selector, options = {}) => {
//     const elements = document.querySelectorAll(selector);
//     if (!elements.length) {
//       return;
//     }
//     if (!("IntersectionObserver" in window)) {
//       elements.forEach((element) => element.classList.add("in-view"));
//       return;
//     }
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (!entry.isIntersecting) {
//           return;
//         }
//         entry.target.classList.add("in-view");
//         observer.unobserve(entry.target);
//       });
//     }, options);
//     elements.forEach((element) => observer.observe(element));
//   };

//   reveal(".pillar-block", { threshold: 0.08 });

//   const chain = document.getElementById("flow-chain");
//   const loop = document.getElementById("flow-loop");
//   if (chain) {
//     const steps = chain.querySelectorAll(".flow-step");
//     if ("IntersectionObserver" in window) {
//       const observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) {
//             return;
//           }
//           steps.forEach((step, index) => {
//             window.setTimeout(() => step.classList.add("in-view"), index * 110);
//           });
//           if (loop) {
//             window.setTimeout(() => loop.classList.add("fire"), 900);
//           }
//           observer.disconnect();
//         });
//       }, { threshold: 0.3 });
//       observer.observe(chain);
//     } else {
//       steps.forEach((step) => step.classList.add("in-view"));
//       loop?.classList.add("fire");
//     }
//   }

//   if (window.gsap && window.ScrollTrigger) {
//     gsap.registerPlugin(ScrollTrigger);
//     gsap.from(".bridge-cell", {
//       y: 28,
//       opacity: 0,
//       stagger: 0.1,
//       duration: 0.7,
//       ease: "power3.out",
//       scrollTrigger: { trigger: ".bridge-grid", start: "top 82%", once: true }
//     });
//     gsap.from(".bridge-left h2, .bridge-left p", {
//       x: -28,
//       opacity: 0,
//       stagger: 0.15,
//       duration: 0.75,
//       ease: "power3.out",
//       scrollTrigger: { trigger: ".services-bridge", start: "top 80%", once: true }
//     });
//     gsap.from(".closing-left > *, .closing-card", {
//       y: 24,
//       opacity: 0,
//       stagger: 0.1,
//       duration: 0.75,
//       ease: "power3.out",
//       scrollTrigger: { trigger: ".services-closing", start: "top 78%", once: true }
//     });
//   }
// };

// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", initializeServicesEcosystemPage);
// } else {
//   initializeServicesEcosystemPage();
// }

// // SERVICES ECOSYSTEM PAGE END
/**
 * HAKAYAA SERVICES â€” services.js
 * Preserves existing GSAP patterns + adds new animations
 */

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CURSOR DOT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initCursorDot = () => {
  const dot = document.querySelector('.cursor-dot');
  if (!dot) return;

  if (!supportsFineHoverPointer()) {
    dot.classList.remove('is-visible', 'visible', 'is-hovering', 'hovering');
    return;
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let mouseX = x, mouseY = y;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('is-visible');
  }, { passive: true });

  document.querySelectorAll('a, button, .hero-pill, .svc-card, .flow-node').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-hovering'));
  });

  const render = () => {
    x += (mouseX - x) * 0.12;
    y += (mouseY - y) * 0.12;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAVBAR â€” hide on scroll down
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initNavbar = () => {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  if (!navbar) return;

  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const cy = window.scrollY;
    const isOpen = navbar.classList.contains('nav-open');
    if (isOpen || cy < 24) {
      navbar.classList.remove('navbar-hidden');
    } else if (cy > lastY + 4) {
      navbar.classList.add('navbar-hidden');
    } else if (cy < lastY - 4) {
      navbar.classList.remove('navbar-hidden');
    }
    lastY = cy;
  }, { passive: true });

  if (toggle && navbar.dataset.mobileNavReady !== "true") {
    navbar.dataset.mobileNavReady = "true";
    toggle.addEventListener('click', () => {
      const open = navbar.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navbar.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        navbar.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        navbar.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO â€” staggered reveal on load
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initHeroReveal = () => {
  const items = document.querySelectorAll('.services-hero .js-reveal');
  if (!items.length) return;

  // If GSAP is loaded, use it for the hero sequence
  if (window.gsap) {
    window.gsap.set(items, { autoAlpha: 0, y: 28 });
    window.gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.3,
      onComplete: () => items.forEach(i => i.classList.add('is-revealed'))
    });
  } else {
    // CSS fallback
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-revealed'), 300 + i * 140);
    });
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO PILL â€” smooth scroll to pillar
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initPillScroll = () => {
  document.querySelectorAll('.hero-pill').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(pill.getAttribute('href'));
      if (target) {
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INTERSECTION OBSERVER â€” pillar blocks
   (CSS transitions triggered by .is-visible)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initPillarReveal = () => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.pillar-block').forEach(b => b.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.pillar-block').forEach(b => obs.observe(b));
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FADE SECTIONS (bridge, flow, closing)
   Matching existing .fade-section pattern
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initFadeSections = () => {
  const sections = document.querySelectorAll('.js-fade-section');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('is-visible'));
    return;
  }

  // GSAP ScrollTrigger path (matching existing script.js pattern)
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    sections.forEach(section => {
      window.gsap.from(section, {
        autoAlpha: 0,
        y: 52,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true,
          onEnter: () => section.classList.add('is-visible')
        }
      });
    });
    return;
  }

  // Pure IO fallback
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => obs.observe(s));
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BRIDGE GRID â€” GSAP stagger (existing pattern)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initBridgeAnim = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from('.bridge-cell', {
    y: 32, autoAlpha: 0,
    stagger: 0.1, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: '.bridge-grid', start: 'top 82%', once: true }
  });

  window.gsap.from('.bridge-left > *', {
    x: -32, autoAlpha: 0,
    stagger: 0.14, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.services-bridge', start: 'top 80%', once: true }
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOW CHAIN ANIMATION
   (extends animateServicesPage pattern)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initFlowAnim = () => {
  const chain = document.getElementById('flow-chain');
  const loopLine = document.getElementById('flow-loop-line');
  const loopLabel = document.getElementById('flow-loop-label');
  if (!chain) return;

  const steps = chain.querySelectorAll('.js-flow-step');

  const revealFlow = () => {
    steps.forEach(s => s.classList.add('is-visible'));
    setTimeout(() => {
      if (loopLine) loopLine.classList.add('is-wide');
      if (loopLabel) loopLabel.classList.add('is-visible');
    }, 800);
  };

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    // GSAP stagger (keeping existing animateServicesPage style)
    window.gsap.from(steps, {
      y: 34, autoAlpha: 0,
      stagger: 0.14, duration: 0.78, ease: 'power3.out',
      scrollTrigger: { trigger: chain, start: 'top 80%', once: true, onEnter: revealFlow }
    });

    window.gsap.from('.flow-node', {
      scale: 0.55, autoAlpha: 0,
      stagger: 0.1, duration: 0.65, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: chain, start: 'top 80%', once: true }
    });

    window.gsap.from('.flow-desc', {
      y: 12, autoAlpha: 0,
      stagger: 0.1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: chain, start: 'top 75%', once: true }
    });
  } else if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { revealFlow(); obs.disconnect(); }
      });
    }, { threshold: 0.3 });
    obs.observe(chain);
  } else {
    revealFlow();
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CLOSING SECTION â€” GSAP (existing pattern)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initClosingAnim = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from('.closing-left > *', {
    x: -32, autoAlpha: 0,
    stagger: 0.12, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.services-closing', start: 'top 78%', once: true }
  });

  window.gsap.from('.closing-card', {
    x: 32, autoAlpha: 0,
    stagger: 0.14, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.closing-right', start: 'top 80%', once: true }
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FOOTER â€” GSAP (matches animateFooter pattern)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initFooterAnim = () => {
  const footer = document.querySelector('.site-footer');
  if (!footer || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  const cols = footer.querySelectorAll('.footer-container > *');
  const bottom = footer.querySelector('.footer-bottom');

  if (cols.length) {
    window.gsap.from(cols, {
      autoAlpha: 0, y: 38,
      stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 88%', once: true }
    });
  }
  if (bottom) {
    window.gsap.from(bottom, {
      autoAlpha: 0, y: 18, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 85%', once: true }
    });
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SERVICE CARD â€” tilt on hover
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initCardTilt = () => {
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PILLAR BADGE â€” counter animation
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initBadgePulse = () => {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const badge = e.target;
      badge.style.animation = 'none';
      badge.offsetHeight; // reflow
      badge.style.animation = 'badgePop 0.55s cubic-bezier(0.16,1,0.3,1) forwards';
      obs.unobserve(badge);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.pillar-badge').forEach(b => obs.observe(b));

  // Inject keyframe if not present
  if (!document.getElementById('badge-kf')) {
    const style = document.createElement('style');
    style.id = 'badge-kf';
    style.textContent = `
      @keyframes badgePop {
        0%   { transform: scale(0.6); opacity: 0; }
        70%  { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1);   opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PHILOSOPHY ITEMS â€” magnetic dot on hover
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initPhiloDotHover = () => {
  document.querySelectorAll('.philo-item').forEach(item => {
    const dot = item.querySelector('.philo-dot');
    if (!dot) return;
    item.addEventListener('mouseenter', () => {
      dot.style.transform = 'scale(1.8)';
      dot.style.boxShadow = '0 0 0 5px rgba(201,162,74,0.25)';
    });
    item.addEventListener('mouseleave', () => {
      dot.style.transform = '';
      dot.style.boxShadow = '';
    });
  });
  // Add transition to dot
  const style = document.createElement('style');
  style.textContent = '.philo-dot { transition: transform 0.3s ease, box-shadow 0.3s ease; }';
  document.head.appendChild(style);
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CLOSING CARDS â€” slide on hover
   (already in CSS; this adds GSAP flair)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initClosingCards = () => {
  if (!window.gsap) return;
  document.querySelectorAll('.closing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      window.gsap.to(card, { x: 8, duration: 0.28, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      window.gsap.to(card, { x: 0, duration: 0.28, ease: 'power2.out' });
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOW NODE â€” pulse ring on hover
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initFlowNodeAnim = () => {
  if (!window.gsap) return;
  document.querySelectorAll('.flow-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      window.gsap.to(node, {
        rotation: 8, scale: 1.15, duration: 0.3, ease: 'back.out(2)'
      });
    });
    node.addEventListener('mouseleave', () => {
      window.gsap.to(node, {
        rotation: 0, scale: 1, duration: 0.3, ease: 'back.out(2)'
      });
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PILLAR STICKY LABEL â€” parallax on scroll
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initStickyLabelParallax = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  document.querySelectorAll('.pillar-sticky-label').forEach(label => {
    window.gsap.to(label, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: label.closest('.pillar-block'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PILLAR VALUE â€” accent bar wipe on scroll
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const initValueBarAnim = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  document.querySelectorAll('.pillar-value').forEach(pv => {
    window.gsap.from(pv, {
      x: -20, autoAlpha: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: pv, start: 'top 88%', once: true }
    });
  });
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BOOT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const boot = () => {
  if (!document.body.classList.contains('services-page')) return;

  initCursorDot();
  initNavbar();
  initHeroReveal();
  initPillScroll();
  initPillarReveal();
  initFadeSections();
  initBridgeAnim();
  initFlowAnim();
  initClosingAnim();
  initFooterAnim();
  initCardTilt();
  initBadgePulse();
  initPhiloDotHover();
  initClosingCards();
  initFlowNodeAnim();
  initStickyLabelParallax();
  initValueBarAnim();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// ABOUT PAGE START
const initializeAboutPage = () => {
  if (!document.body.classList.contains("about-page") || document.body.dataset.aboutPageReady === "true") {
    return;
  }

  document.body.dataset.aboutPageReady = "true";

  const revealItems = document.querySelectorAll(".about-page .ja-fade");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("visible");
      item.querySelector(".aint-rule")?.classList.add("vis");
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      entry.target.querySelector(".aint-rule")?.classList.add("vis");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  revealItems.forEach((item) => revealObserver.observe(item));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAboutPage);
} else {
  initializeAboutPage();
}
// ABOUT PAGE END

// TEAM PAGE START
const initializeTeamPage = () => {
  if (!document.body.classList.contains("team-page") || document.body.dataset.teamPageReady === "true") {
    return;
  }

  document.body.dataset.teamPageReady = "true";

  const dot = document.getElementById("cursorDot");
  if (dot && supportsFineHoverPointer()) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let mx = cx;
    let my = cy;
    let scale = 1;

    window.addEventListener("mousemove", (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.classList.add("visible");
    }, { passive: true });

    document.querySelectorAll("a, button, .tp").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        scale = 2.2;
        dot.classList.add("hovering");
      });
      element.addEventListener("mouseleave", () => {
        scale = 1;
        dot.classList.remove("hovering");
      });
    });

    const renderCursor = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      dot.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) scale(${scale})`;
      window.requestAnimationFrame(renderCursor);
    };

    renderCursor();
  } else if (dot) {
    dot.classList.remove("is-visible", "visible", "is-hovering", "hovering");
  }

  const nav = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");

  if (nav) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      if (currentY < 24 || currentY < lastY) {
        nav.classList.remove("navbar-hidden");
      } else if (currentY > lastY + 4 && !nav.classList.contains("open")) {
        nav.classList.add("navbar-hidden");
      }
      lastY = currentY;
    }, { passive: true });
  }

  if (nav && navToggle && nav.dataset.mobileNavReady !== "true") {
    nav.dataset.mobileNavReady = "true";
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".team-page .nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  document.querySelectorAll(".team-page .js-fade, .team-page #systemSect").forEach((element) => {
    fadeObserver.observe(element);
  });

  const memberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const index = parseInt(entry.target.querySelector(".mn-bg")?.textContent || "0", 10);
      window.setTimeout(() => entry.target.classList.add("visible"), Math.max(index - 1, 0) * 80);
      memberObserver.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  document.querySelectorAll(".team-page .js-member").forEach((element) => {
    memberObserver.observe(element);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTeamPage);
} else {
  initializeTeamPage();
}
// TEAM PAGE END

// CONTACT PAGE START
const initializeContactPage = () => {
  if (!document.body.classList.contains("contact-page") || document.body.dataset.contactPageReady === "true") {
    return;
  }

  document.body.dataset.contactPageReady = "true";

  const dot = document.getElementById("cursorDot");
  let scale = 1;
  if (dot && supportsFineHoverPointer()) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let mx = cx;
    let my = cy;

    window.addEventListener("mousemove", (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.classList.add("is-visible");
    }, { passive: true });

    const renderCursor = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      dot.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) scale(${scale})`;
      window.requestAnimationFrame(renderCursor);
    };

    renderCursor();
  } else if (dot) {
    dot.classList.remove("is-visible", "visible", "is-hovering", "hovering");
  }

  if (dot && supportsFineHoverPointer()) {
  document.querySelectorAll(".contact-page a, .contact-page button, .contact-page .ch-tile, .contact-page .cb-chip").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      scale = 2.2;
      dot?.classList.add("is-hovering");
    });
    element.addEventListener("mouseleave", () => {
      scale = 1;
      dot?.classList.remove("is-hovering");
    });
  });
  }

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  let lastY = window.scrollY;

  if (navbar) {
    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      if (currentY < 24 || currentY < lastY) {
        navbar.classList.remove("navbar-hidden");
      } else if (currentY > lastY + 4 && !navbar.classList.contains("nav-open")) {
        navbar.classList.add("navbar-hidden");
      }
      lastY = currentY;
    }, { passive: true });
  }

  if (navbar && navToggle && navbar.dataset.mobileNavReady !== "true") {
    navbar.dataset.mobileNavReady = "true";
    navToggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".contact-page .nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".contact-page .js-fade").forEach((element) => {
    fadeObserver.observe(element);
  });

  const process = document.querySelector(".contact-page .cb-process");
  if (process) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        process.querySelectorAll(".cb-step").forEach((step, index) => {
          window.setTimeout(() => step.classList.add("visible"), index * 110);
        });
        stepObserver.disconnect();
      });
    }, { threshold: 0.15 });

    stepObserver.observe(process);
  }

  document.querySelectorAll(".contact-page .cf-input").forEach((input) => {
    input.addEventListener("blur", () => {
      input.style.borderColor = input.value.trim() ? "rgba(201,162,74,0.5)" : "";
    });
  });

  const form = document.querySelector(".contact-page [data-contact-form]");
  if (!form) {
    return;
  }

  const button = form.querySelector("[data-submit-button]");
  const status = form.querySelector("[data-form-status]");
  const originalButtonMarkup = button ? button.innerHTML : "";
  const getSubmitEndpoint = () => {
    if (form.dataset.submitUrl) {
      return form.dataset.submitUrl;
    }

    if (window.HAKAYAA_SUBMIT_ENDPOINT) {
      return window.HAKAYAA_SUBMIT_ENDPOINT;
    }

    const isLocalFrontend = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
    return isLocalFrontend && window.location.port !== "3000" ? "http://localhost:3000/submit" : "/submit";
  };
  const submitEndpoint = getSubmitEndpoint();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let busy = false;

  const setStatus = (message, type) => {
    if (!status) {
      return;
    }
    status.textContent = message;
    status.className = "contact-form-status" + (type ? " " + type : "");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (busy) {
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || data.get("mobile") || "").replace(/\D/g, ""),
      message: String(data.get("message") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("Please fill in your name, email, and message.", "is-error");
      return;
    }

    if (!emailPattern.test(payload.email)) {
      setStatus("Please enter a valid email address.", "is-error");
      return;
    }

    if (payload.phone && !/^\d{10,15}$/.test(payload.phone)) {
      setStatus("Phone number must be 10-15 digits.", "is-error");
      return;
    }

    busy = true;
    if (button) {
      button.disabled = true;
      button.innerHTML = "<span>Sending...</span>";
    }
    setStatus("", "");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60000);

    try {
      console.log(`[contact-form] POST ${submitEndpoint}`);

      const response = await window.fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong.");
      }

      form.reset();
      form.querySelectorAll(".cf-input").forEach((input) => {
        input.style.borderColor = "";
      });
      setStatus("Message sent. We'll be in touch within 48 hours.", "is-success");
    } catch (error) {
      console.error("[contact-form] Submission failed:", error);
      setStatus(error.name === "AbortError" ? "The message is taking longer than expected. Please check your sheet before trying again." : (error.message || "Unable to submit right now. Please try again."), "is-error");
    } finally {
      window.clearTimeout(timeoutId);
      busy = false;
      if (button) {
        button.disabled = false;
        button.innerHTML = originalButtonMarkup;
      }
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeContactPage);
} else {
  initializeContactPage();
}
// CONTACT PAGE END
