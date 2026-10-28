(() => {
  'use strict';
  const photos = window.PHOTOS || [];
  const gallery = document.querySelector('#gallery');
  const dialog = document.querySelector('#lightbox');
  const viewerImage = document.querySelector('#viewer-image');
  const counter = document.querySelector('#photo-counter');
  const cake = document.querySelector('#cake');
  const relight = document.querySelector('#relight');
  const title = document.querySelector('#wish-title');
  const instruction = document.querySelector('#instruction');
  const message = document.querySelector('#success-message');
  const confetti = document.querySelector('#confetti');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let previousFocus;
  let isOut = false;
  let confettiTimer;
  function showPhoto(index) {
    const opening = !dialog.open;
    const direction = index < current ? -1 : 1;
    current = (index + photos.length) % photos.length;
    viewerImage.src = photos[current].src;
    viewerImage.alt = photos[current].alt;
    counter.textContent = `${current + 1} / ${photos.length}`;
    dialog.dispatchEvent(new CustomEvent('photochange', {detail: {opening, direction}}));
  }
  function openPhoto(index, button) {
    previousFocus = button;
    showPhoto(index);
    dialog.showModal();
    document.body.classList.add('viewer-open');
    document.querySelector('#close-viewer').focus();
  }
  function photoButton(index, featured = false) {
    const photo = photos[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory';
    button.setAttribute('aria-label', `Abrir foto ${index + 1} de ${photos.length}`);
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = photo.width;
    img.height = photo.height;
    img.loading = featured ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (featured) img.fetchPriority = 'high';
    button.append(img);
    button.addEventListener('click', () => openPhoto(index, button));
    return button;
  }
  photos.forEach((_, index) => gallery.append(photoButton(index)));
  [7, 20].filter(i => photos[i]).forEach(i => document.querySelector('#fan-left').append(photoButton(i, true)));
  [29, 0].filter(i => photos[i]).forEach(i => document.querySelector('#fan-right').append(photoButton(i, true)));
  document.querySelector('#close-viewer').addEventListener('click', () => dialog.close());
  document.querySelector('#prev-photo').addEventListener('click', () => showPhoto(current - 1));
  document.querySelector('#next-photo').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    previousFocus?.focus({preventScroll: true});
  });
  dialog.addEventListener('click', event => {
    if (event.target.classList.contains('viewer-content')) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); }
  });
  let touchStart;
  dialog.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};
    else touchStart = null;
  }, {passive: true});
  dialog.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, {passive: true});
  function celebrate() {
    if (reducedMotion.matches) return;
    clearTimeout(confettiTimer);
    confetti.replaceChildren();
    const colors = ['#b34966','#e9a4b7','#90a792','#e8bb74','#fff9e9'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('i');
      piece.style.cssText = `--x:${Math.random()*100}%;--w:${4+Math.random()*5}px;--h:${7+Math.random()*7}px;--c:${colors[i%colors.length]};--duration:${2.5+Math.random()*2}s;--delay:${Math.random()*.55}s;--drift:${Math.random()*220-110}px;--rotation:${Math.random()*1000-500}deg`;
      fragment.append(piece);
    }
    confetti.append(fragment);
    confettiTimer = setTimeout(() => confetti.replaceChildren(), 5200);
  }
  cake.addEventListener('click', () => {
    if (isOut) return;
    isOut = true;
    cake.classList.add('is-out');
    cake.setAttribute('aria-label', 'Vela apagada');
    cake.setAttribute('aria-disabled', 'true');
    title.textContent = '¡Que se cumpla!';
    instruction.hidden = true;
    message.textContent = 'Un año más de momentos bonitos.';
    relight.hidden = false;
    celebrate();
  });
  relight.addEventListener('click', () => {
    isOut = false;
    cake.classList.remove('is-out');
    cake.setAttribute('aria-label', 'Apagar la vela del pastel');
    cake.removeAttribute('aria-disabled');
    title.textContent = 'Pide un deseo…';
    instruction.hidden = false;
    message.textContent = '';
    relight.hidden = true;
    clearTimeout(confettiTimer);
    confetti.replaceChildren();
    cake.focus({preventScroll: true});
  });
})();
