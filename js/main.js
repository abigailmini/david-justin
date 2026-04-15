/* ═══════════════════════════════════════════════════════════════
   David Justin — Main JS
   Nav scroll · Mobile menu · FAQ accordion · Stats counter · Reveal
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: add 'scrolled' class on scroll ─────────────── */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;

  const onScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── Mobile nav toggle ──────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });


  /* ── FAQ Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item  = btn.parentElement;
      const panel = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        panel.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ── Stats counter animation ────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const isYear   = target > 2000;
    const duration = isYear ? 1200 : 1600;
    const start    = isYear ? 1990 : 0;
    let startTime  = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (target === 99.9) {
        el.textContent = current.toFixed(1);
      } else if (isYear) {
        el.textContent = Math.round(current);
      } else {
        el.textContent = Math.round(current);
      }

      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Trigger when stat section is visible
  const statsSection = document.getElementById('stats');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      statNumbers.forEach(el => animateCounter(el));
    }
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);


  /* ── Scroll reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.program-card, .testimonial-card, .media-card, .stat-item, .faq-item, .about-grid, .section-header'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grids
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (Array.from(revealEls).indexOf(entry.target) % 4));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── Newsletter form ────────────────────────────────────── */
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      const email = input.value.trim();

      if (!email) return;

      // Optimistic UI feedback
      btn.textContent  = '✓ Subscribed!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      input.value = '';
      input.disabled = true;
      btn.disabled   = true;

      setTimeout(() => {
        btn.textContent = 'Subscribe Free';
        btn.style.background = '';
        input.disabled = false;
        btn.disabled   = false;
      }, 4000);
    });
  }


  /* ── Smooth anchor navigation ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── Active nav link highlight on scroll ────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - navbar.offsetHeight - 80;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` 
        ? 'var(--gold)' 
        : '';
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });

});
