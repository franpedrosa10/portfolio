document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  const btnEs = document.getElementById('lang-es');
  const btnEn = document.getElementById('lang-en');
  const modal = document.getElementById('modal-homebanking');
  const openBtn = document.getElementById('project-homebanking');
  const closeBtn = modal?.querySelector('.modal-close');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Cambiar tema (oscuro/claro)
  toggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    toggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
  });

  // Cambiar idioma
  const translate = (lang) => {
    document.querySelectorAll('[data-es]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    btnEs?.classList.toggle('active', lang === 'es');
    btnEn?.classList.toggle('active', lang === 'en');
  };

  btnEs?.addEventListener('click', () => translate('es'));
  btnEn?.addEventListener('click', () => translate('en'));

  // Modal
  openBtn?.addEventListener('click', () => {
    if (!modal) return;
    modal.hidden = false;
    modal.querySelector('iframe')?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    modal.hidden = true;
    openBtn?.focus();
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      openBtn?.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal?.hidden) {
      modal.hidden = true;
      openBtn?.focus();
    }
  });

  // Menú hamburguesa
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('show');
  });

  // Cerrar el menú cuando se hace clic en un link
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('show');
    });
  });
});
