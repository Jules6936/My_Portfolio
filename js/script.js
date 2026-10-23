/* ===== CONFIGURATION : modifiez ici ===== */
const CONFIG = {
  whatsappNumber: '+2290169368440',          // numéro de destination du formulaire
  email: 'julessozehoue223@gmail.com',          // destinataire du formulaire e-mail
  formEndpoint: '',                           // optionnel : URL Formspree/autre pour envoyer l'e-mail sans ouvrir la messagerie
  phones: [
    { label: '+229 01 69 36 84 40', number: '+2290169368440' },
    { label: '+229 01 58 35 15 20', number: '+2290158351520' },
    { label: '+234 702 587 2630',  number: '+2347025872630' }
  ],
  social: {
    facebook: '',                                   // collez l'URL exacte de votre profil Facebook
    instagram: 'https://www.instagram.com/code_crafter2.0/',
    linkedin: ''                                    // collez l'URL exacte de votre profil LinkedIn
  }
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const digits = n => String(n).replace(/\D/g, '');            // format international sans +, espaces, tirets
const waUrl = (text, num = CONFIG.whatsappNumber) => `https://wa.me/${digits(num)}` + (text ? `?text=${encodeURIComponent(text)}` : '');

/* ===== Thème clair / sombre ===== */
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* ===== Liens WhatsApp, téléphones, réseaux ===== */
$$('[data-wa]').forEach(a => {
  const topic = a.dataset.topic;
  a.href = waUrl(topic ? `Bonjour, je souhaite discuter du service : ${topic}.` : 'Bonjour, je vous contacte depuis votre portfolio.');
  a.target = '_blank'; a.rel = 'noopener noreferrer';
});
$('#phones').innerHTML = CONFIG.phones.map(p => `
  <li><span class="ico-box"><svg class="ico"><use href="#i-phone"/></svg></span>
  <a href="tel:+${digits(p.number)}">${p.label}</a>
  <span class="pair"><a class="mini" href="tel:+${digits(p.number)}" aria-label="Appeler ${p.label}"><svg class="ico"><use href="#i-phone"/></svg></a>
  <a class="mini" href="${waUrl('', p.number)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${p.label}"><svg class="ico"><use href="#i-wa"/></svg></a></span></li>`).join('');
$$('[data-social]').forEach(a => {
  const url = CONFIG.social[a.dataset.social];
  if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.title = 'Lien à configurer dans js/script.js'; }
});
$('#year').textContent = new Date().getFullYear();

/* ===== Menu mobile 3D ===== */
const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
$$('.m-link', menu).forEach((l, i) => l.style.setProperty('--i', i));
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  menu.setAttribute('aria-hidden', !open);
  $$('a', menu).forEach(a => a.tabIndex = open ? 0 : -1);
}
setMenu(false);
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
matchMedia('(min-width:1024px)').addEventListener('change', () => setMenu(false));

/* ===== Défilement : progression, retour en haut, section active ===== */
const bar = $('#progress'), toTop = $('#toTop');
function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  toTop.classList.toggle('show', scrollY > 600);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

const links = $$('.nav-link, .m-link');
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => {
    const on = l.getAttribute('href') === '#' + e.target.id;
    l.classList.toggle('active', on); on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
  });
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ===== Apparition au défilement ===== */
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => rev.observe(el));

/* ===== Inclinaison 3D du portrait (souris) ===== */
const tilt = $('#tilt'), c3 = $('.card3d');
if (!reduce && matchMedia('(hover:hover)').matches) {
  tilt.addEventListener('mousemove', e => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c3.style.animation = 'none';
    c3.style.transform = `rotateY(${x * 28}deg) rotateX(${-y * 20}deg)`;
  });
  tilt.addEventListener('mouseleave', () => { c3.style.transform = ''; c3.style.animation = ''; });
}

/* ===== Carrousels 3D : "coverflow" (services) et "ring" = anneau (projets) ===== */
function initCarousel(root) {
  const ringMode = root.dataset.carousel === 'ring';
  const stage = $('.c-stage', root), slides = $$('.c-slide', root), n = slides.length, dots = $('.c-dots', root);
  let t = 0;                                   // position (peut dépasser n pour tourner en continu)
  const idx = () => ((t % n) + n) % n;
  let ring = null;
  if (ringMode) { ring = document.createElement('div'); ring.className = 'ring'; slides.forEach(s => ring.appendChild(s)); stage.appendChild(ring); }
  slides.forEach((s, k) => {
    const d = document.createElement('button');
    d.type = 'button'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', `Aller à la carte ${k + 1}`);
    d.addEventListener('click', () => go(k)); dots.appendChild(d);
    s.addEventListener('click', e => { if (k !== idx()) { e.preventDefault(); go(k); } });
  });
  function setState(s, off) {
    s.classList.toggle('is-active', off === 0);
    s.setAttribute('aria-hidden', off !== 0);
    $$('a,button', s).forEach(x => x.tabIndex = off === 0 ? 0 : -1);
  }
  function fitHeight() {                       // hauteur = carte la plus haute (anneau uniquement)
    if (!ringMode) return;
    const hs = slides.map(s => { const b = s.firstElementChild; b.style.height = 'auto'; const h = b.offsetHeight; b.style.height = ''; return h; });
    stage.style.height = Math.max(...hs) + 8 + 'px';
  }
  function render() {
    fitHeight();
    const i = idx(), w = slides[0].offsetWidth;
    if (ringMode) {
      const a = 360 / n, r = (w / 2) / Math.tan(Math.PI / n) * 1.12 + 10;
      ring.style.transform = `translateZ(${-r}px) rotateY(${-t * a}deg)`;
      slides.forEach((s, k) => {
        let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
        s.style.transform = `rotateY(${k * a}deg) translateZ(${r}px)`;
        s.style.opacity = off === 0 ? 1 : Math.abs(off) === 1 ? .5 : 0;
        s.style.pointerEvents = Math.abs(off) > 1 ? 'none' : 'auto';
        setState(s, off);
      });
    } else {
      const narrow = root.clientWidth < 700;
      const step = narrow ? w * .55 : w * .72, depth = narrow ? 90 : 140, angle = narrow ? 22 : 30;
      slides.forEach((s, k) => {
        let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
        const ab = Math.abs(off), hidden = ab > (narrow ? 1 : 2);
        s.style.transform = `translateX(calc(-50% + ${off * step}px)) translateZ(${-ab * depth}px) rotateY(${-off * angle}deg)`;
        s.style.opacity = hidden ? 0 : 1 - ab * .22;
        s.style.zIndex = 10 - ab;
        s.style.pointerEvents = hidden ? 'none' : 'auto';
        setState(s, off);
      });
    }
    $$('button', dots).forEach((d, k) => d.setAttribute('aria-selected', k === i));
  }
  function go(k) { let d = k - idx(); if (d > n / 2) d -= n; if (d < -n / 2) d += n; t += d; render(); }
  $('.c-prev', root).addEventListener('click', () => { t--; render(); });
  $('.c-next', root).addEventListener('click', () => { t++; render(); });
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { t--; render(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { t++; render(); e.preventDefault(); }
  });
  let sx = null;                               // glisser souris / tactile
  stage.addEventListener('pointerdown', e => { sx = e.clientX; });
  addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 45) { t += dx < 0 ? 1 : -1; render(); } });
  addEventListener('resize', render);
  render();
}
$$('[data-carousel]').forEach(initCarousel);

/* ===== Photo de profil : essaie plusieurs formats (assets/images/profil.*) ===== */
(function () {
  const img = $('.portrait img'); if (!img) return;
  const names = ['profil.jpg', 'profil.jpeg', 'profil.png', 'profil.webp'];
  let k = 0;
  img.onerror = () => { k++; if (k < names.length) img.src = 'assets/images/' + names[k]; else img.remove(); };
  img.src = 'assets/images/' + names[0];
})();

/* ===== Texte animé du hero ===== */
(function () {
  const el = $('#typed'); if (!el) return;
  const words = ['Développeur web', 'Ingénieur systèmes et logiciels', 'IT Manager', 'Consultant informatique'];
  if (reduce) { el.textContent = words[0]; return; }
  let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    c += del ? -1 : 1; el.textContent = word.slice(0, c);
    let delay = del ? 35 : 75;
    if (!del && c === word.length) { del = true; delay = 1600; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
    setTimeout(tick, delay);
  })();
})();

/* ===== Animation "développeur" : code qui s'écrit ===== */
(function () {
  const pre = $('#codeType'); if (!pre) return;
  const lines = [
    '<span class="k">const</span> solution = <span class="k">async</span> (besoin) => {',
    '  <span class="k">const</span> plan = <span class="k">await</span> analyser(besoin);',
    '  <span class="k">const</span> app = concevoir(plan);',
    '  <span class="k">return</span> livrer(app);',
    '};'
  ];
  if (reduce) { pre.innerHTML = lines.join('\n'); return; }
  let l = 0, ch = 0;
  const plain = s => s.replace(/<[^>]+>/g, '');
  function frame() {
    // Reconstruit le HTML en comptant seulement les caractères visibles
    let out = '', shown = 0;
    for (let i = 0; i <= l && i < lines.length; i++) {
      const target = i < l ? Infinity : ch; let buf = '', count = 0, inTag = false;
      for (const chr of lines[i]) {
        if (chr === '<') inTag = true;
        if (!inTag) { if (count >= target) break; count++; }
        buf += chr; if (chr === '>') inTag = false;
      }
      // referme un éventuel <span> ouvert
      const open = (buf.match(/<span/g) || []).length - (buf.match(/<\/span>/g) || []).length;
      out += buf + '</span>'.repeat(Math.max(open, 0)) + (i < l ? '\n' : '');
    }
    pre.innerHTML = out + '<span class="cur"></span>';
    if (l < lines.length) {
      ch++;
      if (ch > plain(lines[l]).length) { l++; ch = 0; }
      setTimeout(frame, 45);
    } else { setTimeout(() => { l = 0; ch = 0; frame(); }, 3500); }
  }
  frame();
})();

/* ===== Cartes compétences retournables ===== */
$$('.flip').forEach(card => {
  const toggle = () => {
    const on = card.classList.toggle('is-flipped');
    card.setAttribute('aria-expanded', on);
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

/* ===== Formulaires : validation commune ===== */
const rules = {
  nom: v => v.trim().length >= 2 || 'Saisissez votre nom (2 caractères minimum).',
  prenom: v => v.trim().length >= 2 || 'Saisissez votre prénom (2 caractères minimum).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Saisissez une adresse e-mail valide, par exemple nom@domaine.com.',
  sujet: v => v.trim().length >= 3 || 'Indiquez le sujet de votre message.',
  message: v => v.trim().length >= 10 || 'Votre message doit contenir au moins 10 caractères.'
};
function check(form, name) {
  const f = form.elements[name], res = rules[name](f.value), field = f.closest('.field'), ok = res === true;
  $('.err', field).textContent = ok ? '' : res;
  field.classList.toggle('invalid', !ok); f.setAttribute('aria-invalid', !ok); return ok;
}
function setupForm(form, send) {
  const names = Object.keys(rules);
  names.forEach(n => form.elements[n].addEventListener('blur', () => check(form, n)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const st = $('.ok', form); st.textContent = '';
    if (names.map(n => check(form, n)).includes(false)) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    send(n => form.elements[n].value.trim(), st, form);
  });
}
const bodyText = v => ['Bonjour, je vous contacte depuis votre portfolio.', '',
  `Nom : ${v('nom')}`, `Prénom : ${v('prenom')}`, `E-mail : ${v('email')}`, `Sujet : ${v('sujet')}`, '', 'Message :', v('message')].join('\n');

/* WhatsApp */
setupForm($('#formWa'), (v, st) => {
  const url = waUrl(bodyText(v));
  const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url;
  st.textContent = 'WhatsApp est ouvert avec votre message. Appuyez sur Envoyer dans WhatsApp pour le confirmer.';
});

/* E-mail : envoi via endpoint si configuré, sinon ouverture de la messagerie (mailto) */
setupForm($('#formMail'), async (v, st, form) => {
  const subject = `[Portfolio] ${v('sujet')}`, body = bodyText(v);
  const viaMailto = () => {
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    st.textContent = 'Votre messagerie s’ouvre avec le message prérempli. Appuyez sur Envoyer pour le confirmer.';
  };
  if (!CONFIG.formEndpoint) return viaMailto();
  try {
    const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ nom: v('nom'), prenom: v('prenom'), email: v('email'), sujet: subject, message: v('message') }) });
    if (!r.ok) throw new Error(r.status);
    form.reset(); st.textContent = 'Message envoyé. Merci, je vous répondrai rapidement.';
  } catch (e) { viaMailto(); }
});

/* Choix du moyen de contact : affiche le formulaire et y défile */
const panels = { mail: $('#formMail'), wa: $('#formWa') };
function showPanel(key, scroll) {
  Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== key; });
  $$('[data-choose]').forEach(b => b.setAttribute('aria-pressed', b.dataset.choose === key));
  if (!scroll) return;
  panels[key].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => panels[key].elements.nom.focus({ preventScroll: true }), reduce ? 0 : 700);
}
$$('[data-choose]').forEach(b => b.addEventListener('click', () => showPanel(b.dataset.choose, true)));
showPanel('wa', false);

/* ===== Images de projets : affichage complet + fond flouté assorti ===== */
$$('.shot img').forEach(img => {
  const done = () => {
    if (!img.naturalWidth) return;
    const s = img.closest('.shot');
    s.classList.add('has-img');
    s.style.setProperty('--img', `url("${img.currentSrc || img.src}")`);
  };
  img.complete ? done() : img.addEventListener('load', done);
});
