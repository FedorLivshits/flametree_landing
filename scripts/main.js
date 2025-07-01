requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add('js-loaded');
  });
});

/* 1. SCSS бандл */
import '../styles/main.scss';

/* 2. WebGL-градиент ─ экспортируемая функция из gradient.js
 *    (мы добавляли её в предыдущем шаге) */
import { initHeroGradient } from './components/gradient.js';
import './components/scrollSteps.js';
import { lenis } from './components/lenis-init.js';
import './components/demo-modal.js';

/* 3. --- Mobile-menu helpers -------------------------------- */
function toggleMobileMenu() {
  document.body.style.overflow = 'hidden';
  document.querySelector('.mobile-menu-overlay')?.classList.toggle('active');
}
function closeMobileMenu() {
  document.querySelector('.mobile-menu-overlay')?.classList.remove('active');
}

/* 4. --- Mobile-menu init ----------------------------------- */
function initMobileMenu() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

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

  parallax();
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
  const viewport = document.querySelector('.uc-viewport'); // ⬅️ scroll-контейнер
  const track = viewport?.querySelector('.uc-track');
  const btnPrev = document.querySelector('.uc-btn.prev');
  const btnNext = document.querySelector('.uc-btn.next');
  const dotsBox = document.querySelector('.uc-dots');
  if (!viewport || !track || !btnPrev || !btnNext || !dotsBox) return;

  /* ---------- helpers ------------------------------------ */
  const cards = [...track.children];
  const cardW = () =>
    cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

  /* ---------- dots --------------------------------------- */
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];
  dots[0].classList.add('is-active');

  /* ---------- navigation --------------------------------- */
  let idx = 0;
  const mq = window.matchMedia('(max-width: 767px)');

  const updateDesktop = () => {
    track.style.transform = `translateX(${-idx * cardW()}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };

  const onScroll = () => {
    const i = Math.round(viewport.scrollLeft / cardW());
    if (i !== idx) {
      idx = i;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
    }
  };

  const goTo = (i) => {
    idx = (i + cards.length) % cards.length;
    if (mq.matches) {
      viewport.scrollTo({
        left: idx * cardW(),
        behavior: 'smooth',
      });
    } else {
      updateDesktop();
    }
  };

  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));

  const toggleMode = ({ matches }) => {
    if (matches) {
      // mobile
      track.style.transform = 'none';
      viewport.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else {
      // desktop
      viewport.removeEventListener('scroll', onScroll);
      updateDesktop();
    }
  };
  mq.addEventListener('change', toggleMode);
  toggleMode(mq);

  window.addEventListener(
    'resize',
    () => {
      if (!mq.matches) updateDesktop();
    },
    { passive: true }
  );
}

/* 7. --- Testimonials slider -------------------------------- */
function initTestimonialsSlider() {
  const viewport = document.querySelector('.t-viewport');
  const track = viewport?.querySelector('.t-track');
  const btnPrev = document.querySelector('.t-btn.prev');
  const btnNext = document.querySelector('.t-btn.next');
  const dotsBox = document.querySelector('.t-dots');
  if (!viewport || !track || !btnPrev || !btnNext || !dotsBox) return;

  /* ---------- dots ---------- */
  const cards = [...track.children];
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];
  dots[0].classList.add('is-active');

  let idx = 0;
  const cardW = () =>
    cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

  const mq = window.matchMedia('(max-width: 1023px)');

  /* ---------- Desktop ---------- */
  const updateDesktop = () => {
    track.style.transform = `translateX(${-idx * cardW()}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };

  /* ---------- Mobile / Tablet ---------- */
  const onScroll = () => {
    const i = Math.round(viewport.scrollLeft / cardW());
    if (i !== idx) {
      idx = i;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
    }
  };

  const goTo = (i) => {
    idx = (i + cards.length) % cards.length;
    if (mq.matches) {
      viewport.scrollTo({ left: idx * cardW(), behavior: 'smooth' });
    } else {
      updateDesktop();
    }
  };

  /* ---------- listeners ---------- */
  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));

  window.addEventListener(
    'resize',
    () => {
      if (!mq.matches) updateDesktop();
    },
    { passive: true }
  );

  const toggleMode = ({ matches }) => {
    if (matches) {
      track.style.transform = 'none';
      viewport.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else {
      viewport.removeEventListener('scroll', onScroll);
      updateDesktop();
    }
  };
  mq.addEventListener('change', toggleMode);
  toggleMode(mq);
}

function loadBotWidget() {
  const script = document.createElement('script');
  script.src = 'https://portal.flametree.ai/public-storage/widget/bot-chat-widget.umd.js';
  script.async = true;
  script.onload = () => {
    window.BotChatWidget?.createBotChat({
      botRoute: 'https://portal.flametree.ai/chatbot/ed3987f2-99b7-4c8f-a17d-8aedc5cad81f',
      elementId: 'chat-widget',
      tooltipText: 'Hi there!✋My name is Flame. I’m here to help you anytime!',
      userName: ' ',
      headerTitle: 'Flame',
      openByDefault: false,
      isFloatingBtn: true,
      version: 'v2',
      multiAgent: false,
      primaryColor: '#f96c15',
      theme: 'light',
      showActionsBtn: false,
      showWaitingMessage: false,
      authorizationToken: '80ClsFmLhy7HY44ShdR9fYzucY3pOgnZvqoNUFS4aojiJrCDud',
      voiceOver: false,
      floatingBtnOpennedIconUrl: '',
      floatingBtnClosedIconUrl: '',
      floatingBtnSize: 58,
    });
  };
  script.onerror = () => console.error('Не удалось загрузить виджет');
  document.body.appendChild(script);
}

/* 8. --- DOM ready ------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initUseCasesSlider();
  initParallax();
  initHeadlineAnimation();
  initTestimonialsSlider();
  loadBotWidget();

  const startGradient = () => initHeroGradient('#gradient-canvas');

  if ('requestIdleCallback' in window) {
    requestIdleCallback(startGradient, { timeout: 1500 });
  } else {
    setTimeout(startGradient, 800);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -88 });
        closeMobileMenu();
      });
    }
  });
});

window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
