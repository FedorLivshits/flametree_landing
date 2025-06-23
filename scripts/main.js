/* 1. SCSS бандл */
import '../styles/main.scss';

/* 2. WebGL-градиент ─ экспортируемая функция из gradient.js
 *    (мы добавляли её в предыдущем шаге) */
import { initHeroGradient } from './components/gradient.js';

/* 3. --- Mobile-menu helpers -------------------------------- */
function toggleMobileMenu() {
  document.querySelector('.mobile-menu-overlay')?.classList.toggle('active');
}
function closeMobileMenu() {
  document.querySelector('.mobile-menu-overlay')?.classList.remove('active');
}

/* 4. --- Mobile-menu init ----------------------------------- */
function initMobileMenu() {
  /* Esc → закрыть */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* body-scroll lock */
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  if (menuOverlay) {
    new MutationObserver((m) => {
      m.forEach((rec) => {
        document.body.style.overflow = rec.target.classList.contains('active') ? 'hidden' : '';
      });
    }).observe(menuOverlay, { attributes: true, attributeFilter: ['class'] });
  }
}

/* 5. --- Parallax ------------------------------------------- */
function initParallax() {
  const els = document.querySelectorAll('.difference [data-speed]');
  if (!els.length) return;

  const parallax = () => {
    const y = window.scrollY;
    els.forEach((el) => (el.style.transform = `translateY(${y * parseFloat(el.dataset.speed)}px)`));
  };

  window.addEventListener('scroll', parallax, { passive: true });
}

/* 6. --- Headline animation --------------------------------- */
function initHeadlineAnimation() {
  const lines = document.querySelectorAll('.headline-line');
  if (!lines.length) return;

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting)),
    {
      root: null,
      rootMargin: '30% 0px -60% 0px',
      threshold: 0,
    }
  );
  lines.forEach((l) => io.observe(l));
}

/* 7. --- Testimonials slider -------------------------------- */
function initTestimonialsSlider() {
  const track = document.querySelector('.t-track');
  const btnPrev = document.querySelector('.t-btn.prev');
  const btnNext = document.querySelector('.t-btn.next');
  const dotsBox = document.querySelector('.t-dots');
  if (!track || !btnPrev || !btnNext || !dotsBox) return;

  const cards = [...track.children];
  let idx = 0;

  /* dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];

  /* helpers */
  const updateUI = () => {
    const cardW =
      cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    track.style.transform = `translateX(${-idx * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  const goTo = (i) => {
    idx = (i + cards.length) % cards.length;
    updateUI();
  };

  /* buttons */
  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));

  window.addEventListener('resize', updateUI, { passive: true });
  updateUI();
}

/* 8. --- DOM ready ------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initParallax();
  initHeadlineAnimation();
  initTestimonialsSlider();

  /* --- WebGL-градиент --- */
  const startGradient = () => initHeroGradient('#gradient-canvas');

  if ('requestIdleCallback' in window) {
    requestIdleCallback(startGradient, { timeout: 1500 });
  } else {
    setTimeout(startGradient, 800); // fallback
  }
});

window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu  = closeMobileMenu;
