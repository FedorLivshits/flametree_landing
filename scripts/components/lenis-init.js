import Lenis from 'lenis';

export const lenis = new Lenis({
  duration: 0.8,
  easing: (t) => t * (2 - t),
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1.2,
  touchMultiplier: 2,
  infinite: false,
  autoRaf: true,
});
