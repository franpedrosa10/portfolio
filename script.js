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

  const bootSequence = document.getElementById('boot-sequence');
  const bootSkip = document.getElementById('boot-skip');
  const bootBar = document.getElementById('boot-progress-bar');

  const terminal = document.getElementById('terminal');
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalMeasure = document.getElementById('terminal-measure');
  const terminalGhost = document.getElementById('terminal-ghost');
  const terminalTabHint = document.getElementById('terminal-tab-hint');
  const terminalOutput = document.getElementById('terminal-output');

  let currentLang = 'es';
  let bootCompleted = false;
  let hasConsolePrimedHelp = false;
  let bootIntervalId;
  let bootFinishTimeoutId;

  const terminalCopy = {
    es: {
      intro: [
        'Portfolio listo. Bienvenid@ recruiter.',
        'Foco: Frontend con Angular + backend Node.js/SQL.',
        'Escribi `help` para ver comandos disponibles.'
      ],
      commands: {
        help: [
          'Comandos: help, about, stack, impact, projects, contact, cv, clear.'
        ],
        about: [
          'Soy Francisco Pedrosa, Full Stack con foco en Frontend Angular.',
          'Construyo interfaces premium, performantes y mantenibles.',
          'Complemento con backend desacoplado y buenas practicas de arquitectura.'
        ],
        stack: [
          'Frontend: Angular, TypeScript, JavaScript, HTML, CSS, Bootstrap, React.',
          'Backend: Node.js, Express, Java, C.',
          'Datos y tooling: SQL, MySQL, Git, GitHub, Postman, Jira, Trello.'
        ],
        impact: [
          'Impacto real en produccion:',
          '- Web institucional del Club Pueyrredon online.',
          '- Ecommerce DigiPoint online.',
          '- Automatizaciones fiscales y contables en operacion con Node.js.',
          '- Y mas soluciones en desarrollo y mejora continua.'
        ],
        projects: [
          'Abriendo seccion de proyectos...'
        ],
        contact: [
          'Abriendo seccion de contacto...'
        ],
        cv: [
          'Abriendo CV en una nueva pestana...'
        ],
        clear: []
      },
      unknown: 'Comando no reconocido. Proba con `help`.'
    },
    en: {
      intro: [
        'Portfolio ready. Welcome recruiter.',
        'Focus: Angular Frontend + Node.js/SQL backend.',
        'Type `help` to see available commands.'
      ],
      commands: {
        help: [
          'Commands: help, about, stack, impact, projects, contact, cv, clear.'
        ],
        about: [
          "I'm Francisco Pedrosa, a Full Stack developer focused on Angular Frontend.",
          'I build premium, performant and maintainable interfaces.',
          'I complement this with decoupled backend services and solid architecture practices.'
        ],
        stack: [
          'Frontend: Angular, TypeScript, JavaScript, HTML, CSS, Bootstrap, React.',
          'Backend: Node.js, Express, Java, C.',
          'Data and tooling: SQL, MySQL, Git, GitHub, Postman, Jira, Trello.'
        ],
        impact: [
          'Real production impact:',
          '- Club Pueyrredon institutional website live.',
          '- DigiPoint ecommerce live.',
          '- Accounting and tax automation workflows running in production with Node.js.',
          '- And more solutions currently being built and improved.'
        ],
        projects: [
          'Opening projects section...'
        ],
        contact: [
          'Opening contact section...'
        ],
        cv: [
          'Opening CV in a new tab...'
        ],
        clear: []
      },
      unknown: 'Unknown command. Try `help`.'
    }
  };

  const terminalCommands = ['help', 'about', 'stack', 'impact', 'projects', 'contact', 'cv', 'clear'];

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

  const updateTranslatablePlaceholders = (lang) => {
    document.querySelectorAll('[data-placeholder-es]').forEach((element) => {
      const key = lang === 'es' ? 'placeholderEs' : 'placeholderEn';
      const translatedValue = element.dataset[key];
      if (translatedValue) {
        element.placeholder = translatedValue;
      }
    });
  };

  const applyLanguage = (lang) => {
    currentLang = lang;
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

    updateTranslatablePlaceholders(lang);

    btnEs?.classList.toggle('active', lang === 'es');
    btnEn?.classList.toggle('active', lang === 'en');
  };

  const writeTerminalLine = (text, type = 'output') => {
    if (!terminalOutput || !text) return;

    const line = document.createElement('p');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const normalizeCommandValue = (value) => value.trim().toLowerCase();

  const getCommandSuggestion = (value) => {
    const normalizedValue = normalizeCommandValue(value);
    if (!normalizedValue || normalizedValue.includes(' ')) return '';

    return terminalCommands.find((command) => command.startsWith(normalizedValue) && command !== normalizedValue) || '';
  };

  const isExactCommand = (value) => {
    const normalizedValue = normalizeCommandValue(value);
    if (!normalizedValue || normalizedValue.includes(' ')) return false;

    return terminalCommands.includes(normalizedValue);
  };

  const setTabHint = (mode) => {
    if (!terminalTabHint) return;

    if (!mode) {
      terminalTabHint.classList.remove('is-visible');
      return;
    }

    if (mode === 'tab') {
      terminalTabHint.textContent = currentLang === 'es' ? terminalTabHint.dataset.esTab || 'Tab completar' : terminalTabHint.dataset.enTab || 'Tab complete';
    }

    if (mode === 'enter') {
      terminalTabHint.textContent = currentLang === 'es' ? terminalTabHint.dataset.esEnter || 'Enter' : terminalTabHint.dataset.enEnter || 'Enter';
    }

    terminalTabHint.classList.add('is-visible');
  };

  const goToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const yOffset = 104;
    const targetY = section.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    const hashValue = `#${sectionId}`;

    if (window.history?.replaceState) {
      window.history.replaceState(null, '', hashValue);
    } else {
      window.location.hash = hashValue;
    }
  };

  const updateTerminalGhost = () => {
    if (!terminalGhost || !terminalInput || !terminalMeasure) return;

    const rawValue = terminalInput.value;
    const normalizedValue = normalizeCommandValue(rawValue);
    const suggestion = getCommandSuggestion(rawValue);

    if (!suggestion || rawValue !== rawValue.trim() || rawValue.includes(' ')) {
      terminalGhost.textContent = '';
      terminalGhost.style.left = '0px';
      setTabHint(isExactCommand(rawValue) ? 'enter' : null);
      return;
    }

    const suffix = suggestion.slice(normalizedValue.length);
    if (!suffix) {
      terminalGhost.textContent = '';
      terminalGhost.style.left = '0px';
      setTabHint(isExactCommand(rawValue) ? 'enter' : null);
      return;
    }

    terminalMeasure.textContent = rawValue;
    const typedWidth = terminalMeasure.getBoundingClientRect().width;

    terminalGhost.textContent = suffix;
    terminalGhost.style.left = `${typedWidth}px`;
    setTabHint('tab');
  };

  const resetTerminal = () => {
    if (!terminalOutput) return;

    terminalOutput.innerHTML = '';
    updateTerminalGhost();
    terminalCopy[currentLang].intro.forEach((line) => {
      writeTerminalLine(line, 'info');
    });
  };

  const executeCommand = (rawCommand) => {
    const command = normalizeCommandValue(rawCommand);
    if (!command) return;

    writeTerminalLine(`fran@portfolio:~$ ${command}`, 'command');

    if (command === 'clear') {
      terminalOutput.innerHTML = '';
      setTabHint(null);
      return;
    }

    if (command === 'projects') {
      terminalCopy[currentLang].commands.projects.forEach((line) => writeTerminalLine(line));
      goToSection('projects');
      return;
    }

    if (command === 'about') {
      terminalCopy[currentLang].commands.about.forEach((line) => writeTerminalLine(line));
      goToSection('about');
      return;
    }

    if (command === 'contact') {
      terminalCopy[currentLang].commands.contact.forEach((line) => writeTerminalLine(line));
      goToSection('contact');
      return;
    }

    if (command === 'cv') {
      terminalCopy[currentLang].commands.cv.forEach((line) => writeTerminalLine(line));
      window.open('CV-Francisco-Pedrosa.pdf', '_blank', 'noopener,noreferrer');
      return;
    }

    const knownCommand = terminalCopy[currentLang].commands[command];
    if (!knownCommand) {
      writeTerminalLine(terminalCopy[currentLang].unknown, 'error');
      return;
    }

    knownCommand.forEach((line) => writeTerminalLine(line));
  };

  const setBootProgress = (progress) => {
    const safeProgress = Math.max(0, Math.min(100, progress));

    if (bootBar) {
      bootBar.style.width = `${safeProgress}%`;
    }

    const progressContainer = bootSequence?.querySelector('.boot-progress');
    progressContainer?.setAttribute('aria-valuenow', String(Math.round(safeProgress)));
  };

  const completeBoot = () => {
    if (bootCompleted) return;

    bootCompleted = true;
    clearInterval(bootIntervalId);
    clearTimeout(bootFinishTimeoutId);

    setBootProgress(100);
    bootSequence?.classList.add('is-hidden');
    terminal?.classList.add('is-active');

    resetTerminal();

    window.setTimeout(() => {
      terminalInput?.focus();
    }, 140);
  };

  const startBootSequence = () => {
    if (!bootSequence || !terminal) {
      resetTerminal();
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completeBoot();
      return;
    }

    let progress = 0;
    setBootProgress(0);

    bootIntervalId = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 18 + 7, 100);
      setBootProgress(progress);

      if (progress >= 100) {
        clearInterval(bootIntervalId);
        bootFinishTimeoutId = window.setTimeout(completeBoot, 220);
      }
    }, 130);
  };

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    setThemeIcon();
  });

  btnEs?.addEventListener('click', () => {
    applyLanguage('es');
    if (bootCompleted) {
      resetTerminal();
    }
  });

  btnEn?.addEventListener('click', () => {
    applyLanguage('en');
    if (bootCompleted) {
      resetTerminal();
    }
  });

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

  bootSkip?.addEventListener('click', completeBoot);

  terminal?.addEventListener('click', () => {
    if (hasConsolePrimedHelp || !bootCompleted || !terminalInput) return;

    hasConsolePrimedHelp = true;
    if (!terminalInput.value.trim()) {
      terminalInput.value = 'help';
      updateTerminalGhost();
    }

    terminalInput.focus();
    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
  });

  terminalForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!terminalInput) return;

    executeCommand(terminalInput.value);
    terminalInput.value = '';
    updateTerminalGhost();
    terminalInput.focus();
  });

  terminalInput?.addEventListener('input', () => {
    updateTerminalGhost();
  });

  terminalInput?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    const suggestion = getCommandSuggestion(terminalInput.value);

    if (suggestion) {
      event.preventDefault();
      terminalInput.value = suggestion;
      updateTerminalGhost();
      return;
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
  startBootSequence();
});
