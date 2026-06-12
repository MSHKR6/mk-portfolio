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
  mobileMenu?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});
document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => mobileMenu?.classList.remove('open')));

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

const parallax = document.querySelector('[data-parallax]');
const light = document.querySelector('.cursor-light');
window.addEventListener('mousemove', (event) => {
  if (light) light.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
  if (!parallax || window.innerWidth < 900) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;
  parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});
