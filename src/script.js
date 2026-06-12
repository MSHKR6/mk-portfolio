const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark');

document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
burger?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.toggle('open');
  burger.classList.toggle('open', !!isOpen);
  mobileMenu?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});
document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu?.classList.remove('open');
  burger?.classList.remove('open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
}));

// закрытие меню по клику вне его
document.addEventListener('click', (event) => {
  if (!mobileMenu?.classList.contains('open')) return;
  if (event.target.closest('.mobile-menu') || event.target.closest('.burger')) return;
  mobileMenu.classList.remove('open');
  burger?.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
  observer.observe(el);
});

// — компактная шапка при прокрутке —
const header = document.querySelector('.header');

// — перетекающий подчерк в меню —
const navEl = document.querySelector('.nav');
const navLinks = navEl ? Array.from(navEl.querySelectorAll('a')) : [];
const ink = document.querySelector('.nav-ink');
let inkPos = { l: 0, r: 0 };
let inkTarget = null;
let inkRaf = 0;
let inkShown = false;
let hoverLink = null;

function inkTick() {
  if (!inkTarget || !ink) return;
  const movingRight = inkTarget.l + inkTarget.r > inkPos.l + inkPos.r;
  const fast = 0.3;
  const slow = 0.14;
  inkPos.l += (inkTarget.l - inkPos.l) * (movingRight ? slow : fast);
  inkPos.r += (inkTarget.r - inkPos.r) * (movingRight ? fast : slow);
  ink.style.left = `${inkPos.l}px`;
  ink.style.width = `${Math.max(6, inkPos.r - inkPos.l)}px`;
  if (Math.abs(inkTarget.l - inkPos.l) > 0.5 || Math.abs(inkTarget.r - inkPos.r) > 0.5) {
    inkRaf = requestAnimationFrame(inkTick);
  }
}

function setInkTarget(link) {
  if (!ink || !navEl) return;
  cancelAnimationFrame(inkRaf);
  if (!link) {
    ink.style.opacity = '0';
    inkShown = false;
    inkTarget = null;
    return;
  }
  const navRect = navEl.getBoundingClientRect();
  const rect = link.getBoundingClientRect();
  inkTarget = { l: rect.left - navRect.left, r: rect.right - navRect.left };
  if (!inkShown) {
    inkPos = { l: inkTarget.l, r: inkTarget.r };
    inkShown = true;
  }
  ink.style.opacity = '1';
  inkRaf = requestAnimationFrame(inkTick);
}

function currentSectionLink() {
  let best = null;
  navLinks.forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.42) best = a;
  });
  return best;
}

function refreshNav() {
  const active = hoverLink ? null : currentSectionLink();
  navLinks.forEach((a) => a.classList.toggle('active', a === active));
  if (!hoverLink) setInkTarget(active);
}

navLinks.forEach((a) => a.addEventListener('mouseenter', () => {
  hoverLink = a;
  navLinks.forEach((x) => x.classList.remove('active'));
  setInkTarget(a);
}));
navEl?.addEventListener('mouseleave', () => {
  hoverLink = null;
  refreshNav();
});
window.addEventListener('scroll', () => {
  header?.classList.toggle('compact', window.scrollY > 60);
  refreshNav();
}, { passive: true });
window.addEventListener('resize', () => {
  inkShown = false;
  refreshNav();
});
header?.classList.toggle('compact', window.scrollY > 60);
refreshNav();

const parallax = document.querySelector('[data-parallax]');
const light = document.querySelector('.cursor-light');
window.addEventListener('mousemove', (event) => {
  if (light) light.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
  if (!parallax || window.innerWidth < 900) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;
  parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});
