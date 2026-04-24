/* ===== Shared theme toggle (injects sun/moon button in .nav) ===== */
(function(){
  // Apply persisted theme ASAP
  try {
    var saved = localStorage.getItem('dj-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-mode', saved);
    } else {
      document.documentElement.setAttribute('data-mode', 'dark');
    }
  } catch(e) {
    document.documentElement.setAttribute('data-mode', 'dark');
  }

  function setMode(m){
    document.documentElement.setAttribute('data-mode', m);
    try { localStorage.setItem('dj-theme', m); } catch(e){}
  }

  function inject(){
    var nav = document.querySelector('.nav');
    if (!nav) return;
    // Avoid double-injection
    if (nav.querySelector('.theme-toggle')) return;
    // Prefer to place BEFORE the CTA for visual rhythm
    var cta = nav.querySelector('.nav-cta');
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label','Toggle color mode');
    btn.innerHTML = ''
      + '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
      +   '<circle cx="12" cy="12" r="4"/>'
      +   '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'
      + '</svg>'
      + '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
      +   '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
      + '</svg>';
    btn.addEventListener('click', function(){
      var cur = document.documentElement.getAttribute('data-mode');
      setMode(cur === 'light' ? 'dark' : 'light');
    });
    if (cta && cta.parentNode === nav) {
      nav.insertBefore(btn, cta);
    } else {
      nav.appendChild(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
