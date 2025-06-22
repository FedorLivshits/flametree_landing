// Mobile Menu Functions
function toggleMobileMenu() {
  const overlay = document.querySelector('.mobile-menu-overlay');
  overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const overlay = document.querySelector('.mobile-menu-overlay');
  overlay.classList.remove('active');
}

// Mobile Menu Event Listeners
function initMobileMenu() {
  // Close mobile menu on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Prevent body scroll when menu is open
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  });

  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  if (menuOverlay) {
    observer.observe(menuOverlay, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

// Parallax Effect
function initParallax() {
  const parallaxEls = document.querySelectorAll('.difference [data-speed]');

  function parallax() {
    const scrolled = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  if (parallaxEls.length > 0) {
    window.addEventListener('scroll', parallax, { passive: true });
  }
}

// Headline Animation
function initHeadlineAnimation() {
  const lines = document.querySelectorAll('.headline-line');

  if (lines.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    {
      root: null,
      rootMargin: '30% 0px -60% 0px',
      threshold: 0,
    }
  );

  lines.forEach((l) => io.observe(l));
}

// Testimonials Slider
function initTestimonialsSlider() {
  const track = document.querySelector('.t-track');
  const btnPrev = document.querySelector('.t-btn.prev');
  const btnNext = document.querySelector('.t-btn.next');
  const dotsBox = document.querySelector('.t-dots');

  if (!track || !btnPrev || !btnNext || !dotsBox) return;

  const cards = [...track.children];
  let idx = 0; // current slide

  /* build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];

  /* helpers */
  function updateUI() {
    const cardW = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    track.style.transform = `translateX(${-idx * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  function goTo(i) {
    idx = (i + cards.length) % cards.length;
    updateUI();
  }

  /* buttons */
  btnPrev.addEventListener('click', () => goTo(idx - 1));
  btnNext.addEventListener('click', () => goTo(idx + 1));

  /* resize recalculation */
  window.addEventListener('resize', updateUI, { passive: true });

  // Initial update
  updateUI();
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initParallax();
  initHeadlineAnimation();
  initTestimonialsSlider();
});

// Export functions for global access (if needed)
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
