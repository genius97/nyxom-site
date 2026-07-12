/* NYXOM — projects data + rendering.
   ⚠️ محتوى المشاريع كله هنا في مكان واحد: عدّل النصوص أدناه وستتحدث
   النسختان العربية والإنجليزية معاً. اللمحات مكتوبة عمداً بدون تفاصيل
   تقنية جوهرية حفاظاً على سرية الأفكار. */
(function () {
  var PROJECTS = [
    {
      id: 'faheem',
      ar: {
        name: 'فهيم',
        tagline: 'دراسة جدوى مؤسسية خلال دقائق',
        desc: 'منصة ذكاء اصطناعي تحوّل فكرة مشروعك إلى دراسة جدوى احترافية بمعايير مؤسسية خلال دقائق بدل أسابيع — مبنية على أدلة وبيانات عُمانية موثّقة، مع مؤشر واضح لجاهزية التمويل.',
        tags: ['ذكاء اصطناعي', 'ريادة أعمال', 'بيانات عُمانية']
      },
      en: {
        name: 'Faheem',
        tagline: 'Institutional feasibility studies in minutes',
        desc: 'An AI platform that turns a business idea into an institutional-grade feasibility study in minutes instead of weeks — grounded in verified Omani market evidence, with a clear funding-readiness score.',
        tags: ['AI', 'Entrepreneurship', 'Omani data']
      },
      letter: 'ف', latin: 'FAHEEM', hue: 222
    },
    {
      id: 'mujeeb',
      ar: {
        name: 'مجيب',
        tagline: 'فريقك الذكي على واتساب',
        desc: 'منصة نمو ذكية للأعمال تعمل مباشرة عبر واتساب: تخدم عملاءك باللهجة العُمانية على مدار الساعة، تبيع وتحجز وتتابع — وتفهم الرسائل الصوتية والصور.',
        tags: ['وكلاء أذكياء', 'واتساب', 'خدمة عملاء']
      },
      en: {
        name: 'Mujeeb',
        tagline: 'Your AI team on WhatsApp',
        desc: 'A smart business-growth platform that lives natively on WhatsApp: serving customers in the local dialect around the clock — selling, booking and following up, while understanding voice notes and images.',
        tags: ['AI agents', 'WhatsApp', 'Customer service']
      },
      letter: 'م', latin: 'MUJEEB', hue: 204
    },
    {
      id: 'naseej',
      ar: {
        name: 'نسيج',
        tagline: 'قصص يكون طفلك بطلها',
        desc: 'منصة تجارة إلكترونية بالذكاء الاصطناعي تصنع كتب قصص مخصّصة يظهر فيها الطفل بطلاً بملامحه واسمه، في مغامرات عربية أصيلة — تصل رقمياً أو مطبوعة بجودة فاخرة.',
        tags: ['ذكاء توليدي', 'تجارة إلكترونية', 'محتوى عربي']
      },
      en: {
        name: 'Naseej',
        tagline: 'Storybooks where your child is the hero',
        desc: 'An AI-powered e-commerce platform crafting personalized storybooks where the child stars as the hero — with their own look and name, in authentic Arabic adventures, delivered digitally or in premium print.',
        tags: ['Generative AI', 'E-commerce', 'Arabic content']
      },
      letter: 'ن', latin: 'NASEEJ', hue: 212
    },
    {
      id: 'spark',
      ar: {
        name: 'سبارك',
        tagline: 'أدر مغسلتك من شاشة واحدة',
        desc: 'منصة سحابية متكاملة لإدارة مغاسل السيارات: نقطة بيع، حجوزات، ولاء عملاء، مخزون وتقارير ذكية — مصمّمة للسوق العُماني وتواصل العمل حتى عند انقطاع الإنترنت.',
        tags: ['SaaS', 'نقاط بيع', 'تحليلات']
      },
      en: {
        name: 'Spark',
        tagline: 'Run your car wash from one screen',
        desc: 'A complete cloud platform for car-wash businesses — POS, bookings, loyalty, inventory and smart reports — built for the Omani market and resilient to internet outages.',
        tags: ['SaaS', 'POS', 'Analytics']
      },
      letter: 'س', latin: 'SPARK', hue: 195
    },
    {
      id: 'dhaki',
      ar: {
        name: 'ذكي',
        tagline: 'رفيقك الدراسي الذكي',
        desc: 'منصة تعليمية تجعل المذاكرة تجربة تشبه اللعب: دروس وتمارين مبنية من المنهج العُماني نفسه، اختبارات محاكية للامتحانات الوزارية، ومعلّم ذكي يشرح من كتاب الطالب مباشرة.',
        tags: ['تعليم', 'معلّم ذكي', 'تلعيب']
      },
      en: {
        name: 'Dhaki',
        tagline: 'The smart study companion',
        desc: 'An educational platform that makes studying feel like play: lessons and exercises built from the official Omani curriculum, ministry-style mock exams, and an AI tutor that explains straight from the student’s own textbook.',
        tags: ['EdTech', 'AI tutor', 'Gamification']
      },
      letter: 'ذ', latin: 'DHAKI', hue: 215
    }
  ];

  /* deterministic pseudo-random from a string seed */
  function rng(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) % 10000) / 10000;
    };
  }

  /* unique constellation emblem per project */
  function emblem(p) {
    var r = rng(p.id), W = 320, H = 200;
    var n = 6 + Math.floor(r() * 3), pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: 30 + (W - 60) * (i / (n - 1)) + (r() - 0.5) * 34,
        y: 46 + (H - 96) * r()
      });
    }
    var goldIdx = Math.floor(r() * n);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" direction="ltr" style="direction:ltr">';
    s += '<defs><radialGradient id="eg-' + p.id + '" cx="78%" cy="12%" r="120%">' +
         '<stop offset="0" stop-color="hsl(' + p.hue + ' 90% 62% / .30)"/>' +
         '<stop offset="55%" stop-color="hsl(' + p.hue + ' 80% 40% / .10)"/>' +
         '<stop offset="1" stop-color="transparent"/></radialGradient></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="#04070F"/>';
    s += '<rect width="' + W + '" height="' + H + '" fill="url(#eg-' + p.id + ')"/>';
    /* ghost Arabic initial */
    s += '<text x="' + (W - 26) + '" y="' + (H - 18) + '" text-anchor="end" font-family="IBM Plex Sans Arabic, sans-serif" font-weight="700" font-size="150" fill="hsl(' + p.hue + ' 90% 70% / .09)">' + p.letter + '</text>';
    /* scattered faint stars */
    for (var j = 0; j < 26; j++) {
      s += '<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * H).toFixed(1) + '" r="' + (0.5 + r() * 0.9).toFixed(2) + '" fill="rgba(200,220,255,' + (0.10 + r() * 0.22).toFixed(2) + ')"/>';
    }
    /* constellation path */
    var path = 'M' + pts.map(function (q) { return q.x.toFixed(1) + ' ' + q.y.toFixed(1); }).join(' L');
    s += '<path d="' + path + '" fill="none" stroke="hsl(' + p.hue + ' 85% 66% / .55)" stroke-width="1.3"/>';
    pts.forEach(function (q, idx) {
      if (idx === goldIdx) {
        var g = 7;
        s += '<path d="M' + q.x + ' ' + (q.y - g) + ' L' + (q.x + g * 0.36) + ' ' + (q.y - g * 0.36) +
             ' L' + (q.x + g) + ' ' + q.y + ' L' + (q.x + g * 0.36) + ' ' + (q.y + g * 0.36) +
             ' L' + q.x + ' ' + (q.y + g) + ' L' + (q.x - g * 0.36) + ' ' + (q.y + g * 0.36) +
             ' L' + (q.x - g) + ' ' + q.y + ' L' + (q.x - g * 0.36) + ' ' + (q.y - g * 0.36) + ' Z" fill="#EFC377"/>';
        s += '<circle cx="' + q.x + '" cy="' + q.y + '" r="10" fill="rgba(239,195,119,.18)"/>';
      } else {
        s += '<circle cx="' + q.x + '" cy="' + q.y + '" r="' + (2 + rngDot(idx)) + '" fill="hsl(' + p.hue + ' 90% 74%)"/>';
        s += '<circle cx="' + q.x + '" cy="' + q.y + '" r="5.5" fill="hsl(' + p.hue + ' 90% 70% / .18)"/>';
      }
    });
    function rngDot(i) { return (i % 3) * 0.4; }
    /* latin label */
    s += '<text x="24" y="34" direction="ltr" text-anchor="start" font-family="Space Grotesk, sans-serif" font-weight="500" font-size="12" letter-spacing="4" fill="rgba(190,205,240,.65)">' + p.latin + '</text>';
    s += '</svg>';
    return s;
  }

  function card(p, lang) {
    var t = p[lang];
    var el = document.createElement('article');
    el.className = 'card project-card reveal';
    el.innerHTML =
      '<div class="project-emblem">' + emblem(p) + '</div>' +
      '<div class="p-name"><b>' + t.name + '</b><span' + (lang === 'en' ? ' style="font-family:var(--font-ar);letter-spacing:0;font-size:1rem"' : '') + '>' + (lang === 'en' ? p.ar.name : p.latin) + '</span></div>' +
      '<p class="muted" style="font-size:.88rem;margin-bottom:.5rem;color:var(--gold)">' + t.tagline + '</p>' +
      '<p>' + t.desc + '</p>' +
      '<div class="p-tags">' + t.tags.map(function (g) { return '<span class="chip">' + g + '</span>'; }).join('') + '</div>';
    return el;
  }

  function mount(sel, lang, limit) {
    var host = document.querySelector(sel);
    if (!host) return;
    var lg = lang || (document.documentElement.lang === 'en' ? 'en' : 'ar');
    PROJECTS.slice(0, limit || PROJECTS.length).forEach(function (p, i) {
      var c = card(p, lg);
      c.style.setProperty('--d', (i * 0.08) + 's');
      host.appendChild(c);
    });
    /* re-observe newly added .reveal elements */
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      host.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
    } else {
      host.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
  }

  window.NYXOM_PROJECTS = { list: PROJECTS, mount: mount };
})();
