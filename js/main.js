// Mobile menu
document.addEventListener('click', e => {
  if (e.target.matches('.burger')) {
    document.querySelector('.nav ul')?.classList.toggle('open');
  }
});

// Mark active nav link
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    if (path.startsWith('project-') && href === 'projects.html') a.classList.add('active');
  });
})();

// Contact form
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = document.querySelector('#form-ok');
    if (ok) ok.style.display = 'block';
    form.reset();
  });
}

// Carousel
document.querySelectorAll('.carousel').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const slides = car.querySelectorAll('.carousel-slide');
  const dotsBox = car.querySelector('.carousel-dots');
  let i = 0;
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => go(idx));
    dotsBox?.appendChild(b);
  });
  const dots = dotsBox?.querySelectorAll('button') || [];
  function go(n){ i = (n + slides.length) % slides.length; track.style.transform = `translateX(-${i*100}%)`; dots.forEach((d,k)=>d.classList.toggle('active',k===i)); }
  car.querySelector('.prev')?.addEventListener('click', () => go(i-1));
  car.querySelector('.next')?.addEventListener('click', () => go(i+1));
  go(0);
});
