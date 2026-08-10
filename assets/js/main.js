const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) { toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', open); }); }
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
