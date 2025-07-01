(() => {
  const steps = [...document.querySelectorAll('.platform .step')];
  const screenImg = document.querySelector('.platform__screen .screen-img');
  const stepsWrap = document.getElementById('platformSteps');
  const dotsBox = document.querySelector('.plat-dots');
  const btnPrev = document.querySelector('.plat-btn.prev');
  const btnNext = document.querySelector('.plat-btn.next');

  if (!steps.length || !screenImg) return;

  const mqMobile = window.matchMedia('(max-width:1050px)');
  let index = 0;

  const setActive = (i) => {
    if (steps[index]) steps[index].classList.remove('is-active');
    if (dotsBox?.children[index]) dotsBox.children[index].classList.remove('is-active');

    index = (i + steps.length) % steps.length;

    steps[index].classList.add('is-active');
    dotsBox?.children[index]?.classList.add('is-active');

    const newSrc = steps[index].dataset.img;
    const currentSrc = screenImg.getAttribute('src');

    if (newSrc && newSrc !== currentSrc) {
      screenImg.style.opacity = 0;
      setTimeout(() => {
        screenImg.setAttribute('src', newSrc);
      }, 350);
    }
  };

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

  // --- Desktop intersection observer
  const ioDesktop = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting && !mqMobile.matches) {
          setActive(steps.indexOf(ent.target));
        }
      });
    },
    { threshold: 0.6, rootMargin: '0px 0px -40% 0px' }
  );
  steps.forEach((s) => ioDesktop.observe(s));

  // --- Mobile scroll handler
  stepsWrap.addEventListener(
    'scroll',
    throttle(() => {
      if (!mqMobile.matches) return;

      const scrollCenter = stepsWrap.scrollLeft + stepsWrap.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      steps.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - scrollCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== index) setActive(closestIndex);
    }, 100),
    { passive: true }
  );

  screenImg.onload = () => {
    screenImg.style.opacity = 1;
  };

  function throttle(fn, wait) {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn(...args);
      }
    };
  }

  setActive(0);
})();
