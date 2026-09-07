const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

document.querySelectorAll('[data-skill-explorer]').forEach((explorer) => {
  const tabs = explorer.querySelectorAll('[role="tab"]');
  const panels = explorer.querySelectorAll('.skill-panel');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((other) => other.setAttribute('aria-selected', 'false'));
    panels.forEach((panel) => panel.classList.remove('active'));
    tab.setAttribute('aria-selected', 'true');
    explorer.querySelector(`[data-panel="${tab.dataset.skill}"]`).classList.add('active');
  }));
});

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog?.querySelector('img');
const dialogCaption = dialog?.querySelector('p');
document.querySelectorAll('[data-lightbox]').forEach((button) => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.lightbox;
  dialogImage.alt = button.querySelector('img').alt;
  dialogCaption.textContent = button.dataset.caption;
  dialog.showModal();
}));
dialog?.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

if (!reduceMotion) {
  const canvas = document.querySelector('#cells');
  const ctx = canvas.getContext('2d');
  let dots = [];
  const setup = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(34, Math.floor(window.innerWidth / 35));
    dots = Array.from({ length: count }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.7 + .5, speed: Math.random() * .18 + .04, angle: Math.random() * Math.PI * 2 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    dots.forEach((dot) => {
      dot.x += Math.cos(dot.angle) * dot.speed;
      dot.y += Math.sin(dot.angle) * dot.speed;
      if (dot.x < -10 || dot.x > window.innerWidth + 10 || dot.y < -10 || dot.y > window.innerHeight + 10) { dot.x = Math.random() * window.innerWidth; dot.y = Math.random() * window.innerHeight; }
      ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(13,114,128,.25)'; ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  setup(); draw(); window.addEventListener('resize', setup);
}
