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
  var heads = {"/our-gaushala/":"bg-photo-04.jpg","/history/":"bg-photo-03.jpg","/land-and-campus/":"bg-shed-05.jpg","/our-herd/":"bg-shed-06.jpg","/management-committee/":"bg-photo-01.jpg","/registrations/":"bg-shed-07.jpg","/reports-and-accounts/":"bg-shed-08.jpg","/visitor-book/":"bg-day-02.jpg","/cow-care/":"bg-shed-09.jpg","/daily-routine/":"bg-shed-10.jpg","/feed-and-fodder/":"bg-shed-11.jpg","/medical-unit/":"bg-shed-12.jpg","/sheds-and-water/":"bg-shed-13.jpg","/rescue-and-intake/":"bg-shed-43.jpg","/old-and-sick-cows/":"bg-shed-14.jpg","/manure-and-biogas/":"bg-shed-15.jpg","/seva/":"bg-shed-16.jpg","/chara-seva/":"bg-shed-02.jpg","/pehli-roti/":"bg-shed-18.jpg","/adopt-a-cow/":"bg-shed-19.jpg","/adopt-a-calf/":"bg-shed-20.jpg","/old-cow-care/":"bg-shed-21.jpg","/medical-seva/":"bg-shed-22.jpg","/nandi-seva/":"bg-shed-23.jpg","/gau-daan/":"bg-shed-24.jpg","/tuladan/":"bg-shed-25.jpg","/gau-puja-occasion-seva/":"bg-shed-26.jpg","/shraddh-seva/":"bg-shed-01.jpg","/tithi-seva/":"bg-shed-28.jpg","/gopashtami-mela-seva/":"bg-night-02.jpg","/shed-and-building-seva/":"bg-shed-29.jpg","/membership/":"bg-shed-30.jpg","/monthly-gau-sevak/":"bg-shed-04.jpg","/in-kind-giving/":"bg-shed-32.jpg","/events-media/":"bg-night-03.jpg","/gopashtami-mela/":"bg-night-04.jpg","/festival-calendar/":"bg-night-05.jpg","/photo-albums/":"bg-night-06.jpg","/video-gallery/":"bg-night-07.jpg","/news-and-press/":"bg-night-08.jpg","/stories/":"bg-night-09.jpg","/visit-services/":"bg-shed-33.jpg","/plan-your-visit/":"bg-shed-34.jpg","/feed-the-cows/":"bg-shed-35.jpg","/gau-puja-booking/":"bg-shed-36.jpg","/celebrate-here/":"bg-night-10.jpg","/volunteer/":"bg-shed-37.jpg","/report-a-cow/":"bg-shed-38.jpg","/products/":"bg-shed-39.jpg","/manure-and-bulk-orders/":"bg-shed-40.jpg","/festival-hampers/":"bg-night-11.jpg","/order-enquiry/":"bg-shed-41.jpg","/donor-desk/":"bg-shed-42.jpg","/my-donations/":"bg-day-03.jpg","/receipts-80g/":"bg-shed-44.jpg","/my-adopted-cow/":"bg-shed-45.jpg","/donor-wall/":"bg-night-12.jpg","/faq/":"bg-night-13.jpg","/contact/":"bg-night-14.jpg","/csr-and-trusts/":"bg-night-15.jpg","/terms/":"bg-night-16.jpg","/privacy/":"bg-night-17.jpg","/refund-policy/":"bg-day-01.jpg","/404.html":"bg-day-15.jpg"};
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
