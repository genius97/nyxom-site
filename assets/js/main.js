/* NYXOM — shared behaviour: nav, reveal-on-scroll, WhatsApp contact form. */
(function () {
  var LANG = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var WHATSAPP = '96896267250'; // +968 9626 7250

  /* ----- header state ----- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- mobile nav ----- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----- reveal on scroll ----- */
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealed.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- year stamp ----- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----- WhatsApp contact form -----
     The form never posts anywhere: it composes a structured message
     and opens WhatsApp chat with +968 9626 7250 directly. */
  var form = document.getElementById('whatsapp-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) {
        var el = form.querySelector('#' + id);
        return el ? el.value.trim() : '';
      };
      var name = get('f-name'), org = get('f-org'),
          service = get('f-service'), msg = get('f-msg');

      var lines = LANG === 'en'
        ? ['Hello Nyxom 👋', 'Name: ' + name]
        : ['مرحباً نكسوم 👋', 'الاسم: ' + name];
      if (org) lines.push((LANG === 'en' ? 'Organization: ' : 'الجهة: ') + org);
      if (service) lines.push((LANG === 'en' ? 'Service: ' : 'الخدمة المطلوبة: ') + service);
      lines.push((LANG === 'en' ? 'Message: ' : 'الرسالة: ') + msg);

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      var note = document.getElementById('form-status');
      if (note) {
        note.textContent = LANG === 'en'
          ? '✓ WhatsApp is opening with your message — just press send.'
          : '✓ سيُفتح واتساب الآن ورسالتك جاهزة — فقط اضغط إرسال.';
      }
    });
  }
})();
