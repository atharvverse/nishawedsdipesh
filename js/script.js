const intro = document.getElementById('intro');
const openButton = document.getElementById('openInvitation');
const site = document.getElementById('site');
const music = document.getElementById('weddingMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

// A restrained shower of tiny ivory and blush petals, independent of slide artwork.
const ambient = document.createElement('div');
ambient.className = 'ambient-layer';
ambient.setAttribute('aria-hidden', 'true');
document.body.appendChild(ambient);
for (let i = 0; i < 10; i++) {
  const petal = document.createElement('i');
  petal.className = 'flower-petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty('--duration', `${15 + Math.random() * 12}s`);
  petal.style.setProperty('--drift', `${Math.round(Math.random() * 100 - 50)}px`);
  petal.style.animationDelay = `${-Math.random() * 22}s`;
  petal.style.setProperty('--size', `${5 + Math.random() * 4}px`);
  ambient.appendChild(petal);
}

openButton.addEventListener('click', () => {
  // Start the soundtrack from the envelope-opening click. This is a real
  // user gesture, so browsers that block unsolicited autoplay will allow it.
  music.play().then(() => {
    musicToggle.setAttribute('aria-pressed', 'true');
    musicLabel.textContent = 'Mute music';
  }).catch(error => {
    // Keep the manual music control available if the browser or device blocks playback.
    musicLabel.textContent = 'Play music';
    console.info('Tap Play Music to start the soundtrack:', error);
  });

  intro.classList.add('is-unfolding');
  window.setTimeout(() => {
    intro.classList.add('is-open');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    document.body.classList.add('invitation-open');
    document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('is-revealed'));
  }, 950);
});

async function toggleMusic() {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'Mute music';
    } catch (error) {
      musicLabel.textContent = 'Play music';
      console.warn('Music could not play. Add assets/audio/wedding-music.mp3.', error);
    }
  } else {
    music.pause();
    musicToggle.setAttribute('aria-pressed', 'false');
    musicLabel.textContent = 'Play music';
  }
}
musicToggle.addEventListener('click', toggleMusic);

// Scroll reveals with graceful fallback for browsers without IntersectionObserver.
const revealItems = document.querySelectorAll('.full-slide, .section, .venue__card, .map-frame');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready');
  revealItems.forEach(el => el.classList.add('reveal-item'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach(el => revealObserver.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-revealed'));
}

// Countdown date is configured in the data-date attribute in index.html.
const countdown = document.getElementById('countdownTimer');
const targetDate = new Date(countdown.dataset.date).getTime();
const pad = value => String(value).padStart(2, '0');
function updateCountdown() {
  if (!Number.isFinite(targetDate)) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(id => { document.getElementById(id).textContent = '--'; });
    return;
  }
  const distance = targetDate - Date.now();
  if (distance <= 0) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }
  document.getElementById('days').textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
  document.getElementById('hours').textContent = pad(Math.floor((distance % 86400000) / 3600000));
  document.getElementById('minutes').textContent = pad(Math.floor((distance % 3600000) / 60000));
  document.getElementById('seconds').textContent = pad(Math.floor((distance % 60000) / 1000));
}
updateCountdown();
window.setInterval(updateCountdown, 1000);
