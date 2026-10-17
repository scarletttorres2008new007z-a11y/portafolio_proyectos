// ===== Tus datos de contacto =====
// Cambia estos valores y se actualizan en todo el sitio.
// whatsapp: solo números con código de país, por ejemplo '50370001234'. Déjalo vacío para ocultar WhatsApp.
const CONTACTO = {
  email: 'torresscarlett502@gmail.com',
  whatsapp: '50372716441',
  instagram: 'scar_torxx_07',
};

document.documentElement.classList.add('js');

// Rellena enlaces y textos de contacto
document.querySelectorAll('[data-email]').forEach(el => {
  el.textContent = CONTACTO.email;
  if (el.tagName === 'A') el.href = `mailto:${CONTACTO.email}`;
});
document.querySelectorAll('[data-instagram]').forEach(el => {
  el.textContent = '@' + CONTACTO.instagram;
  if (el.tagName === 'A') el.href = `https://instagram.com/${CONTACTO.instagram}`;
});
document.querySelectorAll('[data-whatsapp]').forEach(el => {
  if (!CONTACTO.whatsapp) { el.closest('[data-whatsapp-wrap]')?.setAttribute('hidden', ''); return; }
  el.href = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('¡Hola Scarlett! Vi tu portafolio y quiero cotizar una página web.')}`;
});
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Menú móvil
const burger = document.querySelector('.burger');
const menu = document.querySelector('.nav ul');
burger?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? '✕ CERRAR' : '≡ MENÚ';
});

// Marca el enlace activo
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const enProyecto = location.pathname.includes('/projects/');
  document.querySelectorAll('.nav a:not(.logo)').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path || (enProyecto && href === 'projects.html')) a.classList.add('active');
  });
})();

// Aparición suave al hacer scroll (solo lo que está fuera de pantalla)
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.remove('pending'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pending'); io.observe(el); }
  });
}

// Pase de diapositivas del hero
document.querySelectorAll('[data-slideshow]').forEach(show => {
  const slides = [...show.querySelectorAll('.slide')];
  const url = show.querySelector('[data-slide-url]');
  const name = document.querySelector('[data-slide-name]');
  let i = 0;
  const paint = () => {
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    const s = slides[i];
    if (url) url.textContent = s.dataset.url;
    if (name) { name.textContent = s.dataset.name; name.href = s.dataset.link; }
  };
  paint();
  if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => { i = (i + 1) % slides.length; paint(); }, 3200);
  }
});

// Carrusel de capturas
document.querySelectorAll('.carousel').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const slides = car.querySelectorAll('.carousel-slide');
  const dotsBox = car.querySelector('.carousel-dots');
  let i = 0;
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ver captura ${idx + 1}`);
    b.addEventListener('click', () => go(idx));
    dotsBox?.appendChild(b);
  });
  const dots = dotsBox?.querySelectorAll('button') || [];
  function go(n){
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  }
  car.querySelector('.prev')?.addEventListener('click', () => go(i - 1));
  car.querySelector('.next')?.addEventListener('click', () => go(i + 1));
  let x0 = null;
  car.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);
});

// Filtros de proyectos
const filtros = document.querySelector('[data-filters]');
if (filtros) {
  const cards = [...document.querySelectorAll('[data-cat]')];
  filtros.querySelectorAll('button').forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'todos' ? cards.length : cards.filter(c => c.dataset.cat.split(' ').includes(f)).length;
    btn.insertAdjacentHTML('beforeend', `<span class="n">${n}</span>`);
    btn.addEventListener('click', () => {
      filtros.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === btn));
      cards.forEach(c => { c.hidden = f !== 'todos' && !c.dataset.cat.split(' ').includes(f); });
    });
  });
}

// Formulario de contacto: arma el mensaje y lo envía por WhatsApp o correo
const form = document.querySelector('#contact-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo');
  if (tipo) form.querySelector(`input[name="tipo"][data-q="${tipo}"]`)?.click();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const texto = [
      `¡Hola Scarlett! Soy ${d.get('name')}.`,
      d.get('negocio') ? `Mi negocio: ${d.get('negocio')}.` : '',
      d.get('tipo') ? `Me interesa: ${d.get('tipo')}.` : '',
      '',
      d.get('msg'),
      '',
      `Mi correo: ${d.get('email')}`,
    ].filter((l, k, arr) => l !== '' || arr[k - 1] !== '').join('\n');

    const asunto = `Proyecto web · ${d.get('negocio') || d.get('name')}`;
    const destino = CONTACTO.whatsapp
      ? `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`
      : `mailto:${CONTACTO.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;

    const ok = document.querySelector('#form-ok');
    if (ok) {
      ok.hidden = false;
      ok.querySelector('a').href = destino;
    }
    if (CONTACTO.whatsapp) window.open(destino, '_blank', 'noopener');
    else location.href = destino;
  });
}

// Botón flotante "Cotizar" después del hero
const flotante = document.querySelector('.float-cta');
if (flotante) {
  const onScroll = () => flotante.classList.toggle('show', scrollY > innerHeight * .8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
