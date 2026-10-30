// Minimal résumé site behavior

const CAREER_START = new Date(2013, 11, 30); // 2013.12.30 첫 입사

function fullYearsSince(start, now = new Date()) {
  let years = now.getFullYear() - start.getFullYear();
  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  return beforeAnniversary ? years - 1 : years;
}

function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

function initCareerYears() {
  const el = document.getElementById('career-years');
  if (el) el.textContent = fullYearsSince(CAREER_START);
}

function initNav() {
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);

    const probe = window.scrollY + window.innerHeight * 0.3;
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    let current = null;
    sections.forEach(section => {
      if (section.offsetTop <= probe) current = section.id;
    });
    if (atBottom && sections.length) current = sections[sections.length - 1].id;

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', throttle(update, 50), { passive: true });
  update();
}

function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  const update = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', throttle(update, 100), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0 }));
  update();
}

function initPrint() {
  const btn = document.getElementById('print-btn');
  if (btn) btn.addEventListener('click', () => window.print());
}

document.addEventListener('DOMContentLoaded', () => {
  initCareerYears();
  initNav();
  initScrollTop();
  initPrint();
});
