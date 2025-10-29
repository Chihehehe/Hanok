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

  // Menu page data rendering and platter slider
  var isMenuPage = document.body && document.body.classList.contains('menu-page');
  if (isMenuPage) {
    var API_BASE = 'http://localhost:8080';
    var categoryIdByName = {};

    // lightweight image map by item/platter name
    var imageByName = {
      'Galbi': 'https://images.unsplash.com/photo-1604908812551-e3d8b80b9a1c?q=80&w=1600&auto=format&fit=crop',
      'Bulgogi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop',
      'Samgyeopsal': 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1?q=80&w=1600&auto=format&fit=crop',
      'Kimchi Jjigae': 'https://images.unsplash.com/photo-1642178653831-6d7da2c2f6d6?q=80&w=1600&auto=format&fit=crop',
      'Doenjang Jjigae': 'https://images.unsplash.com/photo-1565895405239-45649a92c61c?q=80&w=1600&auto=format&fit=crop',
      'Bibimbap': 'https://images.unsplash.com/photo-1598143123873-9400870b6155?q=80&w=1600&auto=format&fit=crop',
      'Kimchi Pancake': 'https://images.unsplash.com/photo-1648632897823-6f8a784b2ac4?q=80&w=1600&auto=format&fit=crop',
      'Seafood Pancake': 'https://images.unsplash.com/photo-1604908554082-3b0a219c2f28?q=80&w=1600&auto=format&fit=crop',
      'Japchae': 'https://images.unsplash.com/photo-1617093727343-374ea68aa608?q=80&w=1600&auto=format&fit=crop',
      'Original Fried Chicken': 'https://images.unsplash.com/photo-1604908176997-431c6d53295d?q=80&w=1600&auto=format&fit=crop',
      'Yangnyeom': 'https://images.unsplash.com/photo-1593032465173-8cc8e9ae4f5c?q=80&w=1600&auto=format&fit=crop',
      'Soy Garlic': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      'Steamed Rice': 'https://images.unsplash.com/photo-1604908554700-8dc10078a7b1?q=80&w=1600&auto=format&fit=crop',
      'Kimchi': 'https://images.unsplash.com/photo-1617093727304-8c443eb0cf4b?q=80&w=1600&auto=format&fit=crop',
      'Banchan Refill': 'https://images.unsplash.com/photo-1576866209830-5d45a2b13f95?q=80&w=1600&auto=format&fit=crop'
    };

    function imgFor(name) {
      return imageByName[name] || 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop';
    }

    function createDishRow(item) {
      var row = document.createElement('div');
      row.className = 'dish-row';
      row.innerHTML = '\n        <img class="dish-thumb" alt="' + item.name + '" loading="lazy" src="' + imgFor(item.name) + '"/>\n        <div class="dish-body">\n          <h3>' + item.name + '</h3>\n          ' + (item.description ? ('<p>' + item.description + '</p>') : '') + '\n        </div>\n        <div class="dish-price">$' + Number(item.price).toFixed(2) + '</div>\n      ';
      return row;
    }

    function renderCategoryGrid(gridId, items) {
      var grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';
      items.forEach(function (it) { grid.appendChild(createDishRow(it)); });
    }

    function renderPlattersList(platters) {
      var grid = document.getElementById('grid-platters');
      if (!grid) return;
      grid.innerHTML = '';
      platters.forEach(function (p) { grid.appendChild(createDishRow(p)); });
    }

    // Tabs: show one category section at a time
    function showSection(sectionId) {
      var links = document.querySelectorAll('.menu-categories a[data-tab]');
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-tab') === sectionId); });
      var ids = ['platters','entree','main-soup','deep-fried-chicken','side-menu','bbq-range'];
      ids.forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;
        if (id === sectionId) sec.removeAttribute('data-collapsed'); else sec.setAttribute('data-collapsed', 'true');
      });
      var panel = document.querySelector('.menu-content');
      if (panel) panel.scrollTop = 0;
    }

    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('.menu-categories a[data-tab]');
      if (!a) return;
      e.preventDefault();
      var id = a.getAttribute('data-tab');
      showSection(id);
      // Lazy load if empty
      var gridMap = {
        'platters': 'grid-platters',
        'entree': 'grid-entree',
        'main-soup': 'grid-main-soup',
        'deep-fried-chicken': 'grid-deep-fried-chicken',
        'side-menu': 'grid-side-menu',
        'bbq-range': 'grid-bbq-range'
      };
      var gridId = gridMap[id];
      var gridEl = gridId && document.getElementById(gridId);
      if (gridEl && gridEl.children.length === 0) {
        if (id === 'platters' && window.__plattersData) {
          renderPlattersList(window.__plattersData);
        } else {
          var nameBySection = {
            'entree': 'Entrée',
            'main-soup': 'Main & Soup',
            'deep-fried-chicken': 'Deep Fried Chicken',
            'side-menu': 'Side Menu',
            'bbq-range': 'BBQ Range'
          };
          var catName = nameBySection[id];
          var catId = catName ? categoryIdByName[catName] : null;
          if (catId) {
            fetch(API_BASE + '/api/menu-items?categoryId=' + catId)
              .then(function (r) { return r.json(); })
              .then(function (items) { renderCategoryGrid(gridId, items || []); })
              .catch(function () { /* ignore */ });
          }
        }
      }
    });

    // Fetch and render
    Promise.all([
      fetch(API_BASE + '/api/categories').then(function (r) { return r.json(); }),
      fetch(API_BASE + '/api/platters').then(function (r) { return r.json(); })
    ]).then(function (results) {
      var categories = results[0] || [];
      var platters = results[1] || [];
      var plattersData = platters;

      // Mock platters when backend isn't running or via ?mock=1
      function mockPlatters() {
        return [
          { name: 'Platter A (Beef Lovers)', description: 'Galbi, Bulgogi, Brisket, banchan', price: 89 },
          { name: 'Platter B (Pork & Beef)', description: 'Pork Belly, Bulgogi, Spicy Pork', price: 79 },
          { name: 'Platter C (Sea & Land)', description: 'Beef, prawns, squid, salad', price: 85 },
          { name: 'Platter D (Chef\'s Choice)', description: 'Daily premium selection', price: 98 },
          { name: 'Platter E (Family Set)', description: 'Beef, pork, chicken, rice & soup', price: 99 },
          { name: 'Platter F (Spicy Mix)', description: 'Spicy pork, spicy chicken, spicy tofu', price: 82 },
          { name: 'Platter G (Vegetarian)', description: 'Tofu steak, mushrooms, seasonal veg', price: 72 }
        ];
      }
      var forceMock = (typeof window !== 'undefined') && window.location && window.location.search.indexOf('mock=1') !== -1;
      if (forceMock || !platters.length) {
        platters = mockPlatters();
      }
      categories.forEach(function (c) { categoryIdByName[c.name] = c.id; });
      renderPlattersList(platters);

      function loadCategory(name, gridId) {
        var id = categoryIdByName[name];
        if (!id) return;
        fetch(API_BASE + '/api/menu-items?categoryId=' + id)
          .then(function (r) { return r.json(); })
          .then(function (items) { renderCategoryGrid(gridId, items || []); })
          .catch(function () { /* ignore */ });
      }

      // Load only the default visible section (Entrée)
      loadCategory('Entrée', 'grid-entree');
      showSection('entree');

      // Remember data for lazy-platters rendering if needed
      window.__plattersData = plattersData;
    }).catch(function () {
      // Full fallback: render mock platters and some mock items per category
      var plats = [
        { name: 'Platter A (Beef Lovers)', description: 'Galbi, Bulgogi, Brisket, banchan', price: 89 },
        { name: 'Platter B (Pork & Beef)', description: 'Pork Belly, Bulgogi, Spicy Pork', price: 79 },
        { name: 'Platter C (Sea & Land)', description: 'Beef, prawns, squid, salad', price: 85 }
      ];
      renderPlattersList(plats);

      function mock(name, desc, price) { return { name: name, description: desc, price: price }; }
      renderCategoryGrid('grid-entree', [
        mock('Kimchi Pancake', 'Crispy pancake with kimchi', 14),
        mock('Seafood Pancake', 'Scallion pancake with seafood', 16),
        mock('Japchae', 'Glass noodles with vegetables', 13)
      ]);
      // Keep others empty until clicked for a cleaner initial view
      /* renderCategoryGrid('grid-main-soup', [
        mock('Kimchi Jjigae', 'Hearty kimchi stew', 16),
        mock('Doenjang Jjigae', 'Soybean paste stew', 15),
        mock('Bibimbap', 'Rice with toppings', 17)
      ]);
      renderCategoryGrid('grid-deep-fried-chicken', [
        mock('Original Fried Chicken', 'Classic crispy', 22),
        mock('Yangnyeom', 'Sweet & spicy', 24),
        mock('Soy Garlic', 'Savory soy garlic', 24)
      ]);
      renderCategoryGrid('grid-side-menu', [
        mock('Steamed Rice', 'Short-grain rice', 3),
        mock('Kimchi', 'House-made kimchi', 4),
        mock('Banchan Refill', 'Seasonal sides', 5)
      ]);
      renderCategoryGrid('grid-bbq-range', [
        mock('Galbi', 'Marinated short ribs', 28),
        mock('Bulgogi', 'Marinated sliced beef', 22),
        mock('Samgyeopsal', 'Pork belly', 20)
      ]); */
      showSection('entree');
      window.__plattersData = plats;
    });
  }
})();


