(function () {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('jasicorp-theme', theme);
    toggles.forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
})();
