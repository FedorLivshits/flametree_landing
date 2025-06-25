/* ============================================================================
   PLATFORM – sticky-screen + carousel (desktop / tablet / mobile)
   ========================================================================== */
(() => {
  const steps = [...document.querySelectorAll('.platform .step')];
  const screenImg = document.querySelector('.platform__screen .screen-img');
  const stepsWrap = document.getElementById('platformSteps');
  const dotsBox = document.querySelector('.plat-dots');
  const btnPrev = document.querySelector('.plat-btn.prev');
  const btnNext = document.querySelector('.plat-btn.next');
  if (!steps.length || !screenImg) return;

  /* -------------------------------------------------- helpers */
  const mqMobile = window.matchMedia('(max-width:1050px)');
  let index = 0;

  const setActive = (i) => {
    steps[index].classList.remove('is-active');
    dotsBox?.children[index]?.classList.remove('is-active');

    index = (i + steps.length) % steps.length;

    steps[index].classList.add('is-active');
    dotsBox?.children[index]?.classList.add('is-active');

    /* fade-смена картинки */
    const newSrc = steps[index].dataset.img;
    if (newSrc && newSrc !== screenImg.src) {
      screenImg.style.opacity = 0;
      setTimeout(() => {
        screenImg.src = newSrc;
      }, 180);
    }
  };

  /* -------------------------------------------------- dots / arrows (<=1050) */
  if (dotsBox) {
    steps.forEach((_, i) => {
      const d = document.createElement('span');
      d.addEventListener('click', () => scrollToCard(i));
      dotsBox.appendChild(d);
    });
  }

  const scrollToCard = (i) => {
    const cardW = steps[0].offsetWidth + parseFloat(getComputedStyle(stepsWrap).gap || 0);
    stepsWrap.scrollTo({ left: cardW * i, behavior: 'smooth' });
  };

  btnPrev?.addEventListener('click', () => scrollToCard(index - 1));
  btnNext?.addEventListener('click', () => scrollToCard(index + 1));

  /* -------------------------------------------------- observers */
  /* desktop: intersection-observer */
  const ioDesktop = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting && !mqMobile.matches) setActive(steps.indexOf(ent.target));
      });
    },
    { threshold: 0.6, rootMargin: '0px 0px -40% 0px' }
  );
  steps.forEach((s) => ioDesktop.observe(s));

  /* mobile: scroll listener on horizontal list */
  stepsWrap.addEventListener(
    'scroll',
    throttle(() => {
      if (!mqMobile.matches) return;
      const scrollX = stepsWrap.scrollLeft + stepsWrap.offsetWidth * 0.5;
      const cardW = steps[0].offsetWidth + parseFloat(getComputedStyle(stepsWrap).gap || 0);
      const i = Math.round(scrollX / cardW) - 1;
      if (i !== index) setActive(i);
    }, 100),
    { passive: true }
  );

  /* on img load restore opacity */
  screenImg.onload = () => {
    screenImg.style.opacity = 1;
  };

  /* -------------------------------------------------- utils */
  function throttle(fn, wait) {
    let t = 0;
    return (...a) => {
      const now = Date.now();
      if (now - t >= wait) {
        t = now;
        fn(...a);
      }
    };
  }

  /* init */
  setActive(0);
})();
