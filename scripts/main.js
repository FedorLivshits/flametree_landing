/* 1. SCSS бандл */
import '../styles/main.scss';

/* 2. WebGL-градиент ─ экспортируемая функция из gradient.js
 *    (мы добавляли её в предыдущем шаге) */
import { initHeroGradient } from './components/gradient.js';
import './components/scrollSteps.js';
import './components/lenis-init.js';
import './components/demo-modal.js';

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
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting)),
    {
      root: null,
      rootMargin: '0px 0px -25% 0px',
      threshold: 0,
    }
  );
  lines.forEach((l) => io.observe(l));
}

/* === Use-Cases slider ===================================== */
function initUseCasesSlider() {
  const track = document.querySelector('.uc-track');
  const btnPrev = document.querySelector('.uc-btn.prev');
  const btnNext = document.querySelector('.uc-btn.next');
  const dotsBox = document.querySelector('.uc-dots');
  if (!track || !btnPrev || !btnNext || !dotsBox) return;

  const cards = [...track.children];

  /* --- dots --- */
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];
  dots[0].classList.add('is-active');

  /* helpers */
  const cardW = () =>
    cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);

  let idx = 0;
  const updateDesktop = () => {
    track.style.transform = `translateX(${-idx * cardW()}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  const goTo = (i) => {
    idx = (i + cards.length) % cards.length;
    updateDesktop();
  };

  /* buttons */
  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));
  window.addEventListener('resize', updateDesktop, { passive: true });

  /* mobile scroll-sync */
  const mq = window.matchMedia('(max-width: 767px)');
  const onScroll = () => {
    const i = Math.round(track.scrollLeft / cardW());
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  const toggleMode = (e) => {
    if (e.matches) {
      // mobile
      track.style.transform = 'none';
      track.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else {
      // desktop
      track.removeEventListener('scroll', onScroll);
      updateDesktop();
    }
  };
  mq.addEventListener('change', toggleMode);
  toggleMode(mq);
}

/* 7. --- Testimonials slider -------------------------------- */
function initTestimonialsSlider() {
  const track = document.querySelector('.t-track');
  const btnPrev = document.querySelector('.t-btn.prev');
  const btnNext = document.querySelector('.t-btn.next');
  const dotsBox = document.querySelector('.t-dots');
  if (!track || !btnPrev || !btnNext || !dotsBox) return;

  const cards = [...track.children];
  const makeDot = (i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goTo(i));
    return dot;
  };
  dotsBox.append(...cards.map((_, i) => makeDot(i)));
  const dots = [...dotsBox.children];

  /* ----------  Desktop режим  ---------- */
  let idx = 0; // текущий слайд
  const cardW = () =>
    cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);

  const updateDesktop = () => {
    track.style.transform = `translateX(${-idx * cardW()}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  const goTo = (i) => {
    idx = (i + cards.length) % cards.length;
    updateDesktop();
  };

  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));
  window.addEventListener('resize', updateDesktop, { passive: true });

  /* ----------  Мобильный режим  ---------- */
  const mq = window.matchMedia('(max-width: 767px)');
  const onScroll = () => {
    const i = Math.round(track.scrollLeft / cardW());
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };

  const toggleMode = (e) => {
    if (e.matches) {
      // мобильный
      track.style.transform = 'none';
      track.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // инициализируем точки
    } else {
      // десктоп
      track.removeEventListener('scroll', onScroll);
      updateDesktop();
    }
  };
  mq.addEventListener('change', toggleMode);
  toggleMode(mq); // первичный вызов
}

/* 8. --- DOM ready ------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initUseCasesSlider();
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
window.closeMobileMenu = closeMobileMenu;
