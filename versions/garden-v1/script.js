const openButton = document.getElementById('openButton');
const toast = document.getElementById('toast');
const opening = document.querySelector('.opening');
const petalField = document.getElementById('petalField');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const followingSections = document.querySelectorAll('main > section:not(.opening)');
followingSections.forEach(section => { section.inert = true; });

openButton.addEventListener('click', () => {
  if (opening.classList.contains('is-opening')) return;
  opening.classList.add('is-opening');
  openButton.disabled = true;
  window.setTimeout(() => {
    document.body.classList.add('experience-open');
    opening.classList.add('scene-open');
    document.getElementById('gardenScene').setAttribute('aria-hidden', 'false');
    followingSections.forEach(section => { section.inert = false; });
  }, prefersReducedMotion ? 0 : 750);
  window.setTimeout(() => opening.classList.add('message-open'), prefersReducedMotion ? 0 : 1750);
});

if (!prefersReducedMotion) {
  for (let i = 0; i < 25; i++) {
    const petal = document.createElement('i');
    petal.className = 'petal';
    petal.style.setProperty('--x', `${(i * 37.7) % 100}%`);
    petal.style.setProperty('--size', `${5 + (i % 5) * 2}px`);
    petal.style.setProperty('--delay', `${(i * 0.71) % 12}s`);
    petal.style.setProperty('--duration', `${10 + (i % 7) * 2}s`);
    petal.style.setProperty('--drift', `${((i % 5) - 2) * 50}px`);
    petalField.appendChild(petal);
  }
  opening.addEventListener('pointermove', event => {
    if (!opening.classList.contains('scene-open')) return;
    const rect = opening.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    opening.style.setProperty('--pointer-x', `${x * 24}px`);
    opening.style.setProperty('--pointer-y', `${y * 18}px`);
    opening.style.setProperty('--sky-x', `${x * -8}px`);
    opening.style.setProperty('--sky-y', `${y * -6}px`);
  });
}

function updateCountdown() {
  const wedding = new Date('2026-12-06T16:00:00+11:00').getTime();
  const left = Math.max(0, wedding - Date.now());
  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left / 3600000) % 24);
  const minutes = Math.floor((left / 60000) % 60);
  const seconds = Math.floor((left / 1000) % 60);
  for (const [id, value] of Object.entries({ days, hours, minutes, seconds })) {
    document.getElementById(id).textContent = String(value).padStart(2, '0');
  }
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
}

async function shareInvitation() {
  const data = { title: 'Kanishka & Jinit | Wedding Invitation', text: 'Join us on Sunday, 6 December 2026 at Gledswood Homestead and Winery.', url: location.href.split('#')[0] };
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(data.url);
      showToast('Invitation link copied');
    } else {
      throw new Error('Clipboard unavailable');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Copy this page’s address to share it');
  }
}
document.getElementById('shareButton').addEventListener('click', shareInvitation);
document.getElementById('bottomShare').addEventListener('click', shareInvitation);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}
