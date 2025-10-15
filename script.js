(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const year = document.getElementById('year');
  const form = document.querySelector('.contact-form');
  const statusEl = document.querySelector('.form-status');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Smooth scroll and close mobile nav
  function handleNavClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    const href = target.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    event.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  }
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (t && t.closest && t.closest('.nav a')) handleNavClick(e);
  });

  // Active link on scroll
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(function (el) { return !!el; });

  function setActiveLink() {
    var fromTop = window.scrollY + 90;
    var current = null;
    sections.forEach(function (section) {
      if (!(section instanceof HTMLElement)) return;
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        current = section;
      }
    });
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (current) {
      var id = '#' + current.id;
      var active = navLinks.find(function (a) { return a.getAttribute('href') === id; });
      if (active) active.classList.add('active');
    }
  }
  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('load', setActiveLink);

  // Simple client-side form handling
  if (form && statusEl) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var message = String(data.get('message') || '').trim();
      if (!name || !email || !message) {
        statusEl.textContent = 'Please fill out all fields.';
        return;
      }
      statusEl.textContent = 'Thanks! We will get back to you shortly.';
      form.reset();
    });
  }
})();


