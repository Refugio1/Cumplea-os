(() => {
  'use strict';
  const dialog = document.querySelector('#lightbox');
  const image = document.querySelector('#viewer-image');
  const content = dialog.querySelector('.viewer-content');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'photo-confetti';
  canvas.setAttribute('aria-hidden', 'true');
  dialog.append(canvas);
  const context = canvas.getContext('2d');
  const colors = ['#ff82ae', '#ffc966', '#b8dcc4', '#ffebe3', '#e295de', '#f24b7d'];
  let frame = 0;
  let particles = [];
  let lastTime = 0;
  let width = 0;
  let height = 0;
  let photoRequest = 0;
  function stopConfetti() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    particles = [];
    context?.clearRect(0, 0, width, height);
    canvas.classList.remove('is-bursting');
  }
  function drawStar(size) {
    context.beginPath();
    for (let point = 0; point < 10; point++) {
      const angle = point * Math.PI / 5 - Math.PI / 2;
      const radius = point % 2 ? size * .42 : size;
      context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    context.closePath();
    context.fill();
  }
  function render(now) {
    frame = 0;
    if (!dialog.open || motion.matches || document.hidden) { stopConfetti(); return; }
    const delta = Math.min(2, Math.max(.1, (now - lastTime) / 16.667));
    lastTime = now;
    context.clearRect(0, 0, width, height);
    particles = particles.filter(particle => particle.age < particle.life && particle.y < height + 40);
    for (const particle of particles) {
      particle.age += delta;
      particle.vx *= Math.pow(.988, delta);
      particle.vy += .17 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.angle += particle.spin * delta;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.angle);
      context.globalAlpha = Math.min(1, Math.max(0, (particle.life - particle.age) / 28));
      context.fillStyle = particle.color;
      if (particle.shape === 0) drawStar(particle.size);
      else if (particle.shape === 1) {
        context.beginPath();
        context.ellipse(0, 0, particle.size * .65, particle.size * .65, 0, 0, Math.PI * 2);
        context.fill();
      } else {
        const flutter = .3 + .7 * Math.abs(Math.cos(particle.age * .12));
        context.scale(1, flutter);
        context.fillRect(-particle.size / 2, -particle.size, particle.size, particle.size * 2);
      }
      context.restore();
    }
    if (particles.length) frame = requestAnimationFrame(render);
    else stopConfetti();
  }
  function burst(opening) {
    stopConfetti();
    if (!context || !dialog.open || motion.matches || document.hidden) return;
    width = dialog.clientWidth;
    height = dialog.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.round((width < 600 ? 90 : 140) * (opening ? 1 : .65));
    const speedScale = Math.min(1, width / 680);
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const center = i % 7 === 0;
      const angle = center ? Math.random() * Math.PI * 2 : -Math.PI * (.12 + Math.random() * .29);
      const speed = center ? 3 + Math.random() * 8 : 11 + Math.random() * 11;
      particles.push({
        x: width * (center ? .5 : side === 1 ? .06 : .94),
        y: height * (center ? .44 : .69),
        vx: Math.cos(angle) * speed * side * speedScale,
        vy: Math.sin(angle) * speed * .85,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - .5) * .3,
        size: 3 + Math.random() * (width < 600 ? 4 : 5),
        color: colors[i % colors.length],
        shape: i % 6,
        age: 0,
        life: 95 + Math.random() * 40
      });
    }
    canvas.classList.add('is-bursting');
    lastTime = performance.now();
    frame = requestAnimationFrame(render);
  }
  dialog.addEventListener('photochange', event => {
    const {opening, direction} = event.detail;
    const request = ++photoRequest;
    // The modal is opened synchronously by the gallery after it selects the image.
    queueMicrotask(() => {
      if (!dialog.open || motion.matches || request !== photoRequest) return;
      burst(opening);
      content.getAnimations().forEach(animation => animation.cancel());
      if (opening) content.animate([
        {opacity: .3, transform: 'scale(.94)'},
        {opacity: 1, transform: 'scale(1.012)', offset: .72},
        {opacity: 1, transform: 'scale(1)'}
      ], {duration: 600, easing: 'cubic-bezier(.16,1,.3,1)'});
    });
    image.getAnimations().forEach(animation => animation.cancel());
    const revealPhoto = () => {
      if (!dialog.open || motion.matches || request !== photoRequest) return;
      image.animate(opening ? [
        {opacity: 0, transform: 'scale(.8) rotate(-5deg)'},
        {opacity: 1, transform: 'scale(1.025) rotate(1deg)', offset: .7},
        {opacity: 1, transform: 'scale(1) rotate(0deg)'}
      ] : [
        {opacity: .25, transform: `translateX(${direction * 65}px) scale(.95) rotate(${direction * 2}deg)`},
        {opacity: 1, transform: 'translateX(0) scale(1) rotate(0deg)'}
      ], {duration: opening ? 720 : 420, easing: 'cubic-bezier(.16,1,.3,1)'});
    };
    if (typeof image.decode === 'function') image.decode().then(revealPhoto).catch(() => {});
    else image.addEventListener('load', revealPhoto, {once: true});
  });
  function stopEffects() {
    photoRequest++;
    stopConfetti();
    image.getAnimations().forEach(animation => animation.cancel());
    content.getAnimations().forEach(animation => animation.cancel());
  }
  dialog.addEventListener('close', stopEffects);
  window.addEventListener('resize', stopConfetti, {passive: true});
  motion.addEventListener('change', () => { if (motion.matches) stopEffects(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopEffects(); });
})();
