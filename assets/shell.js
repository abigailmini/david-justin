// Reveal on scroll — with immediate-in-viewport fallback so content never stays hidden
(function(){
  const reveal = (el) => el.classList.add('in');
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };
  const els = document.querySelectorAll('.reveal');

  // Immediately show anything already on screen (covers hero + above-the-fold)
  els.forEach(el => { if (inView(el)) reveal(el); });

  // Observe the rest as they scroll in
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    els.forEach(reveal);
  }

  // Final safety net — after 1.5s, reveal anything still hidden
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(reveal);
  }, 1500);
})();

// Nav scroll state — intensify backdrop + compact padding once user scrolls past 80px
(function(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
