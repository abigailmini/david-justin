/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 50
    ? '0 4px 30px rgba(0,0,0,0.5)'
    : '';
});

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ===== STATS COUNTER ===== */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const start = performance.now();

  // Special case: years (large numbers like 2017)
  const isYear = target > 2000;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isYear
      ? Math.round(2000 + (target - 2000) * eased)
      : isDecimal
        ? (target * eased).toFixed(1)
        : Math.round(target * eased);

    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

/* ===== INTERSECTION OBSERVER ===== */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

// Fade-in
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in to sections and cards
  const fadeTargets = document.querySelectorAll(
    '.program-card, .testimonial-card, .media-card, .gallery-item, .faq-item, .video-item, .stat-item, .press-img-item, .about-content, .about-visual, .gwr-banner-wrap'
  );
  fadeTargets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    fadeObserver.observe(el);
  });

  // Stats
  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const a = b.nextElementSibling;
      if (a) a.style.maxHeight = '0';
    });

    // Open clicked if was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ===== NEWSLETTER FORM ===== */
const form = document.getElementById('newsletterForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const email = input?.value;

  if (!email) return;

  const orig = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.disabled = true;
  btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';

  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    btn.style.background = '';
    input.value = '';
  }, 3000);
});

/* ===== GALLERY LIGHTBOX (simple) ===== */
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      padding:20px;animation:fadeIn 0.2s ease;
    `;
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.style.cssText = `max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;`;
    overlay.appendChild(clone);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// Add fadeIn keyframes once
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;
document.head.appendChild(style);
