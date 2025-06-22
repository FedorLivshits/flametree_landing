console.log('Landing page ready');

import { Gradient } from './components/gradient.js';

window.addEventListener('DOMContentLoaded', () => {
  new Gradient().initGradient('#hero-gradient');
});
