(() => {
  const steps = [...document.querySelectorAll('.platform .step')];
  const screenImg = document.querySelector('.platform__screen .screen-img');
  const stepsWrap = document.getElementById('platformSteps');
  const dotsBox = document.querySelector('.plat-dots');
  const btnPrev = document.querySelector('.plat-btn.prev');
  const btnNext = document.querySelector('.plat-btn.next');

  if (!steps.length || !screenImg) return;

  /* ---------- Настройки ---------- */
  const mqMobile = window.matchMedia('(max-width:1050px)');
  let index = 0;

  /* ---------- Кеш картинок ---------- */
  const cache = new Map(); // url -> Promise<HTMLImageElement>

  function preload(src) {
    if (!cache.has(src)) {
      cache.set(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        })
      );
    }
    return cache.get(src);
  }

  /* заранее качаем ВСЕ картинки */
  steps.forEach((s) => preload(s.dataset.img));

  /* ---------- Отрисовка активного шага ---------- */
  async function setActive(i) {
    if (steps[index]) steps[index].classList.remove('is-active');
    dotsBox?.children[index]?.classList.remove('is-active');

    index = (i + steps.length) % steps.length;

    steps[index].classList.add('is-active');
    dotsBox?.children[index]?.classList.add('is-active');

    const newSrc = steps[index].dataset.img;
    if (!newSrc || newSrc === screenImg.src) return;

    screenImg.style.opacity = 0; // гасим старый скрин

    const img = await preload(newSrc); // ждём, пока новый скрин декодируется
    screenImg.src = img.src;
    screenImg.onload = null; // сброс
    screenImg.style.opacity = 1; // плавно показываем
  }

  /* ---------- Точки ---------- */
  if (dotsBox) {
    steps.forEach((_, i) => {
      const d = document.createElement('span');
      d.addEventListener('click', () => scrollToCard(i));
      dotsBox.appendChild(d);
    });
  }

  /* ---------- Прокрутка ленты ---------- */
  function scrollToCard(i) {
    const cardW = steps[0].offsetWidth + parseFloat(getComputedStyle(stepsWrap).gap || 0);
    stepsWrap.scrollTo({ left: cardW * ((i + steps.length) % steps.length), behavior: 'smooth' });
  }

  btnPrev?.addEventListener('click', () => scrollToCard(index - 1));
  btnNext?.addEventListener('click', () => scrollToCard(index + 1));

  /* ---------- Desktop: IntersectionObserver ---------- */
  const ioDesktop = new IntersectionObserver(
    (entries) =>
      entries.forEach((ent) => {
        if (ent.isIntersecting && !mqMobile.matches) {
          setActive(steps.indexOf(ent.target));
        }
      }),
    { threshold: 0.2, rootMargin: '0px 0px -40% 0px' }
  );
  steps.forEach((s) => ioDesktop.observe(s));

  /* ---------- Mobile: scroll-sync ---------- */
  stepsWrap.addEventListener(
    'scroll',
    throttle(() => {
      if (!mqMobile.matches) return;

      const center = stepsWrap.scrollLeft + stepsWrap.offsetWidth / 2;
      let bestI = 0;
      let bestD = Infinity;

      steps.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (d < bestD) {
          bestD = d;
          bestI = i;
        }
      });

      if (bestI !== index) setActive(bestI);
    }, 100),
    { passive: true }
  );

  /* ---------- Вспом. функции ---------- */
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

  /* ---------- Инициализация ---------- */
  setActive(0);
})();
