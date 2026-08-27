const nav = document.querySelector('#nav');
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const header = document.querySelector('#header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 18);
}, { passive: true });

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
} else revealEls.forEach(el => el.classList.add('visible'));

// Collection: colour + shape filters + instant search.
const products = [...document.querySelectorAll('.product')];
const search = document.querySelector('#collectionSearch');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const resetCollection = document.querySelector('#resetCollection');
const activeFilters = { category: 'all', shape: 'all' };

function applyCollectionFilters() {
  const query = (search?.value || '').trim().toLowerCase();
  let visible = 0;
  products.forEach(card => {
    const categoryMatch = activeFilters.category === 'all' || card.dataset.category === activeFilters.category;
    const shapeMatch = activeFilters.shape === 'all' || card.dataset.shape === activeFilters.shape;
    const text = `${card.dataset.name || ''} ${card.dataset.search || ''}`.toLowerCase();
    const searchMatch = !query || text.includes(query);
    const show = categoryMatch && shapeMatch && searchMatch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'stone' : 'stones'}`;
  if (emptyState) emptyState.hidden = visible !== 0;
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.dataset.filterType || 'category';
    activeFilters[type] = button.dataset.filter || 'all';
    document.querySelectorAll(`.filter[data-filter-type="${type}"]`).forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    applyCollectionFilters();
  });
});

search?.addEventListener('input', applyCollectionFilters);
resetCollection?.addEventListener('click', () => {
  activeFilters.category = 'all';
  activeFilters.shape = 'all';
  if (search) search.value = '';
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.filter[data-filter-type="category"][data-filter="all"], .filter[data-filter-type="shape"][data-filter="all"]').forEach(b => b.classList.add('active'));
  applyCollectionFilters();
});
applyCollectionFilters();

const form = document.querySelector('#enquiryForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const interest = data.get('interest');
    const message = data.get('message');
    const text = `Hello PESANDU GEMS!\n\nName: ${name}\nInterest: ${interest}\nMessage: ${message}`;
    window.open(`https://wa.me/94771771820?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}

document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
