(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const hero = document.querySelector('.celebration');
  const cards = [...document.querySelectorAll('.gallery .memory')];
  const targets = [document.querySelector('.album-heading'), ...cards, document.querySelector('footer')].filter(Boolean);
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let observer;
  let frame = 0;
  let maxScroll = 1;
  function reveal(element) {
    element.classList.add('is-visible');
    observer?.unobserve(element);
  }
  function update() {
    frame = 0;
    if (document.hidden) return;
    const scroll = Math.max(0, window.scrollY);
    root.style.setProperty('--reading-progress', Math.min(1, scroll / maxScroll).toFixed(4));
    if (reducedMotion.matches) return;
    // Only the opening composition drifts; photos in the album stay steady to read.
    const distance = Math.min(scroll, hero.offsetHeight);
    hero.style.setProperty('--photo-drift', `${(distance * .065).toFixed(1)}px`);
    hero.style.setProperty('--cake-drift', `${(distance * .025).toFixed(1)}px`);
    hero.style.setProperty('--star-turn', `${(distance * .035).toFixed(1)}deg`);
  }
  function scheduleUpdate() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(update);
  }
  function measure() {
    maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    scheduleUpdate();
  }
  function configureMotion() {
    observer?.disconnect();
    targets.forEach(element => element.classList.remove('scroll-reveal', 'is-visible'));
    document.body.classList.toggle('motion-enabled', !reducedMotion.matches);
    if (reducedMotion.matches) {
      hero.style.removeProperty('--photo-drift');
      hero.style.removeProperty('--cake-drift');
      hero.style.removeProperty('--star-turn');
      return;
    }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        // Screen position, rather than photo index, defines the stagger in masonry columns.
        const entering = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        entering.forEach((entry, index) => {
          entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 65}ms`);
          reveal(entry.target);
        });
      }, {threshold: 0, rootMargin: '0px 0px -24px 0px'});
      targets.forEach((element, index) => {
        element.style.setProperty('--reveal-lean', `${index % 2 ? -2 : 2}deg`);
        element.classList.add('scroll-reveal');
        observer.observe(element);
      });
    }
    scheduleUpdate();
  }
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.scroll-reveal');
    if (target) {
      target.style.setProperty('--reveal-delay', '0ms');
      reveal(target);
    }
  });
  window.addEventListener('scroll', scheduleUpdate, {passive: true});
  window.addEventListener('resize', measure, {passive: true});
  window.addEventListener('pageshow', measure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else scheduleUpdate();
  });
  reducedMotion.addEventListener('change', configureMotion);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  configureMotion();
  measure();
})();
