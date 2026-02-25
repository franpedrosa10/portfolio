document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const body = document.body;

  const themeToggle = document.getElementById('theme-toggle');
  const btnEs = document.getElementById('lang-es');
  const btnEn = document.getElementById('lang-en');

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  const modal = document.getElementById('modal-homebanking');
  const openBtn = document.getElementById('project-homebanking');
  const closeBtn = modal?.querySelector('.modal-close');
  const modalFrame = modal?.querySelector('iframe');

  const setThemeIcon = () => {
    const icon = themeToggle?.querySelector('i');
    if (!icon) return;

    if (body.classList.contains('dark')) {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  };

  const closeMenu = () => {
    navLinks?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    body.classList.add('modal-open');
    closeBtn?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    body.classList.remove('modal-open');

    if (modalFrame) {
      const currentSrc = modalFrame.src;
      modalFrame.src = currentSrc;
    }

    openBtn?.focus();
  };

  const applyLanguage = (lang) => {
    html.setAttribute('lang', lang);

    document.querySelectorAll('[data-es]').forEach((element) => {
      const translatedValue = element.dataset[lang];
      if (!translatedValue) return;

      if (element.tagName === 'IMG') {
        element.src = translatedValue;
      } else {
        element.textContent = translatedValue;
      }
    });

    btnEs?.classList.toggle('active', lang === 'es');
    btnEn?.classList.toggle('active', lang === 'en');
  };

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    setThemeIcon();
  });

  btnEs?.addEventListener('click', () => applyLanguage('es'));
  btnEn?.addEventListener('click', () => applyLanguage('en'));

  hamburger?.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isExpanded));
    navLinks?.classList.toggle('show');
  });

  document.querySelectorAll('#nav-links a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navLinks || !hamburger) return;

    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });

  openBtn?.addEventListener('click', openModal);
  openBtn?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (navLinks?.classList.contains('show')) {
        closeMenu();
      }

      if (modal && !modal.hidden) {
        closeModal();
      }
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  applyLanguage('es');
  setThemeIcon();
});
