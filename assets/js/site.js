(function () {
  var root = document.documentElement;

  // Language toggle: English is the default; the choice is remembered on this device.
  function setLang(hi) {
    root.classList.toggle('hi', hi);
    root.lang = hi ? 'hi' : 'en';
    document.querySelectorAll('[data-kg-lang]').forEach(function (b) { b.setAttribute('aria-pressed', hi ? 'true' : 'false'); });
    try { localStorage.setItem('kgLang', hi ? 'hi' : 'en'); } catch (e) {}
  }
  setLang(root.classList.contains('hi'));
  document.querySelectorAll('[data-kg-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(!root.classList.contains('hi')); });
  });

  // Mobile menu.
  var toggle = document.querySelector('.kg-nav-toggle');
  var nav = document.getElementById('kg-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('kg-nav-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle.click(); toggle.focus(); }
    });
  }

  // Sub-menu buttons, so dropdowns open by tap and keyboard as well as hover.
  document.querySelectorAll('.kg-menu > li.menu-item-has-children, .kg-menu > li.page_item_has_children').forEach(function (li, i) {
    var sub = li.querySelector('ul');
    if (!sub) return;
    sub.id = sub.id || 'kg-sub-' + i;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kg-sub-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', sub.id);
    var a = li.querySelector('a');
    var en = a.querySelector('.lang-en');
    btn.innerHTML = '<span class="screen-reader-text"></span><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>';
    btn.firstChild.textContent = 'Show sub-menu: ' + (en ? en.textContent : a.textContent);
    li.querySelector('a').after(btn);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.kg-sub-toggle[aria-expanded="true"]').forEach(function (o) {
        if (o !== btn) { o.setAttribute('aria-expanded', 'false'); o.parentElement.classList.remove('is-open'); }
      });
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      li.classList.toggle('is-open', !open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.kg-menu')) {
      document.querySelectorAll('.kg-menu li.is-open').forEach(function (li) {
        li.classList.remove('is-open');
        var b = li.querySelector('.kg-sub-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Hero video: only play when motion is welcome and the connection is not marked as data-saving.
  var v = document.querySelector('.kg-hero-video');
  if (v) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var save = navigator.connection && navigator.connection.saveData;
    if (reduce || save) { v.remove(); }
    else { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
})();

document.querySelectorAll('.kg-hero-video').forEach(function (v) { v.addEventListener('timeupdate', function () { if (v.currentTime > 4.4) { v.currentTime = 0; } }); });
// Gaushala photos as backgrounds: every page heading and every home-page section has its own picture; none repeats.
(function () {
  var base = '/assets/img/bg/';
  var heads = {};
  var head = document.querySelector('.kg-page-head');
  var img = heads[location.pathname];
  if (head && img) {
    head.classList.add('has-image', 'kg-photo-head');
    head.style.setProperty('--kg-head-img', "url('" + base + img + "')");
  }
  if (document.body.classList.contains('kg-home') || location.pathname === '/') {
    var set = function (el, file) { if (el) { el.classList.add('kg-photo-bg'); el.style.setProperty('--kg-bg', "url('" + base + file + "')"); } };
    set(document.querySelector('.kg-hero'), 'bg-shed-27.jpg');
    var bands = ['bg-shed-17.jpg', 'bg-shed-03.jpg'];
    document.querySelectorAll('.kg-band').forEach(function (b, i) { if (bands[i]) { set(b, bands[i]); } });
    set(document.querySelector('.kg-trust'), 'bg-shed-31.jpg');
  }
})();

// Full-screen home hero: banner video as the background, sized to the screen so it stays sharp
(function () {
  var bg = document.querySelector('.kg-hero-bgvideo');
  var body = document.body;
  if (body.classList.contains('kg-home')) {
    var onScroll = function () { body.classList.toggle('kg-scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (!bg) { return; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bg.removeAttribute('autoplay'); return; }
  var need = Math.max(window.innerWidth, window.innerHeight * 1.5) * Math.min(window.devicePixelRatio || 1, 2);
  var size = need <= 1300 ? 1280 : need <= 1950 ? 1920 : need <= 2600 ? 2560 : 3840;
  bg.src = '/assets/video/hero-banner-' + size + '.mp4';
  var p = bg.play(); if (p && p.catch) { p.catch(function () {}); }
})();

// Menu headings open their dropdown only; they no longer link to a page
(function () {
  document.querySelectorAll('.kg-menu > li.menu-item-has-children > a, .kg-menu > li.page_item_has_children > a').forEach(function (a) {
    var li = a.parentElement;
    var btn = li.querySelector(':scope > .kg-sub-toggle');
    a.removeAttribute('href');
    a.setAttribute('role', 'button');
    a.setAttribute('tabindex', '0');
    a.setAttribute('aria-haspopup', 'true');
    a.classList.add('kg-menu-heading');
    var open = function (e) { e.preventDefault(); e.stopPropagation(); if (btn) { btn.click(); } else { li.classList.toggle('is-open'); } };
    a.addEventListener('click', open);
    a.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { open(e); } });
  });
})();
