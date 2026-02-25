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

  // Menu page data rendering (dark design with carousels)
  var isMenuPage = document.body && document.body.classList.contains('menu-page');
  var isDarkMenu = isMenuPage && document.body.classList.contains('menu-page--dark');
  if (isMenuPage && isDarkMenu) {
    var API_BASE = 'http://localhost:8080';
    var categoryIdByName = {};
    var carouselIndex = {};

    var imageByName = {
      'Galbi': 'https://images.unsplash.com/photo-1604908812551-e3d8b80b9a1c?q=80&w=800&auto=format&fit=crop',
      'Bulgogi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop',
      'Samgyeopsal': 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1?q=80&w=800&auto=format&fit=crop',
      'Kimchi Jjigae': 'https://images.unsplash.com/photo-1642178653831-6d7da2c2f6d6?q=80&w=800&auto=format&fit=crop',
      'Doenjang Jjigae': 'https://images.unsplash.com/photo-1565895405239-45649a92c61c?q=80&w=800&auto=format&fit=crop',
      'Bibimbap': 'https://images.unsplash.com/photo-1598143123873-9400870b6155?q=80&w=800&auto=format&fit=crop',
      'Kimchi Pancake': 'https://images.unsplash.com/photo-1648632897823-6f8a784b2ac4?q=80&w=800&auto=format&fit=crop',
      'Seafood Pancake': 'https://images.unsplash.com/photo-1604908554082-3b0a219c2f28?q=80&w=800&auto=format&fit=crop',
      'Japchae': 'https://images.unsplash.com/photo-1617093727343-374ea68aa608?q=80&w=800&auto=format&fit=crop',
      'Original Fried Chicken': 'https://images.unsplash.com/photo-1604908176997-431c6d53295d?q=80&w=800&auto=format&fit=crop',
      'Yangnyeom': 'https://images.unsplash.com/photo-1593032465173-8cc8e9ae4f5c?q=80&w=800&auto=format&fit=crop',
      'Soy Garlic': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      'Steamed Rice': 'https://images.unsplash.com/photo-1604908554700-8dc10078a7b1?q=80&w=800&auto=format&fit=crop',
      'Kimchi': 'https://images.unsplash.com/photo-1617093727304-8c443eb0cf4b?q=80&w=800&auto=format&fit=crop',
      'Banchan Refill': 'https://images.unsplash.com/photo-1576866209830-5d45a2b13f95?q=80&w=800&auto=format&fit=crop'
    };
    var koreanByName = {
      'Kimchi Jjigae': '김치찌개',
      'Doenjang Jjigae': '된장찌개',
      'Bibimbap': '돌솥비빔밥',
      'Kimchi Pancake': '김치전',
      'Seafood Pancake': '해물파전',
      'Japchae': '잡채',
      'Original Fried Chicken': '후라이드',
      'Yangnyeom': '양념치킨',
      'Soy Garlic': '간장치킨',
      'Steamed Rice': '공기밥',
      'Kimchi': '김치',
      'Banchan Refill': '반찬 리필',
      'Galbi': '갈비',
      'Bulgogi': '불고기',
      'Samgyeopsal': '삼겹살'
    };
    var heroBySection = {
      'platters': { label: 'PLATTERS', title: 'Sharing Sets' },
      'entree': { label: 'ENTRÉE', title: 'Starters & Small Plates' },
      'main-soup': { label: 'MAIN & SOUP', title: 'Soup & Rice & Noodle' },
      'deep-fried-chicken': { label: 'DEEP FRIED', title: 'Korean Fried Chicken' },
      'side-menu': { label: 'SIDE MENU', title: 'Sides & Staples' },
      'bbq-range': { label: 'BBQ RANGE', title: 'Grill Classics' }
    };
    var codePrefixBySection = { platters: 'P', entree: 'E', 'main-soup': 'M', 'deep-fried-chicken': 'C', 'side-menu': 'S', 'bbq-range': 'B' };

    function imgFor(name) { return imageByName[name] || 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop'; }
    function koreanFor(name) { return koreanByName[name] || ''; }

    function createMenuCardDark(item, code) {
      var card = document.createElement('div');
      card.className = 'menu-card-dark';
      var korean = koreanFor(item.name);
      var desc = (item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      card.innerHTML =
        '<div class="menu-card-dark__img-wrap"><img src="' + imgFor(item.name) + '" alt="' + (item.name || '').replace(/"/g, '&quot;') + '" loading="lazy"/></div>' +
        '<div class="menu-card-dark__body">' +
        '<span class="menu-card-dark__code">' + (code || '') + '</span>' +
        '<h3 class="menu-card-dark__name">' + (item.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h3>' +
        (korean ? '<p class="menu-card-dark__korean">' + korean.replace(/</g, '&lt;') + '</p>' : '') +
        (desc ? '<p class="menu-card-dark__desc">' + desc + '</p>' : '') +
        '<div class="menu-card-dark__price">$' + Number(item.price).toFixed(2) + '</div>' +
        '</div>';
      return card;
    }

    function updateHero(sectionId) {
      var meta = heroBySection[sectionId];
      var labelEl = document.getElementById('hero-category-label');
      var titleEl = document.getElementById('hero-category-title');
      if (meta && labelEl && titleEl) {
        labelEl.textContent = meta.label;
        titleEl.textContent = meta.title;
      }
    }

    function renderSectionCarousel(sectionId, items) {
      var track = document.getElementById('carousel-' + sectionId);
      var dotsEl = document.getElementById('dots-' + sectionId);
      if (!track || !items || !items.length) return;
      var prefix = codePrefixBySection[sectionId] || '';
      track.innerHTML = '';
      items.forEach(function (it, i) {
        var code = prefix + (i + 1) + '.';
        track.appendChild(createMenuCardDark(it, code));
      });
      carouselIndex[sectionId] = 0;
      updateCarouselDots(sectionId, items.length);
      updateCarouselTransform(sectionId, items.length);
    }

    function updateCarouselDots(sectionId, count) {
      var dotsEl = document.getElementById('dots-' + sectionId);
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      var maxVisible = 3;
      var numDots = Math.max(1, Math.ceil(count - maxVisible + 1));
      for (var i = 0; i < numDots; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.classList.toggle('active', i === 0);
        (function (idx) {
          btn.addEventListener('click', function () {
            carouselIndex[sectionId] = idx;
            updateCarouselTransform(sectionId, count);
            dotsEl.querySelectorAll('button').forEach(function (b, j) { b.classList.toggle('active', j === idx); });
          });
        })(i);
        dotsEl.appendChild(btn);
      }
    }

    function updateCarouselTransform(sectionId, count) {
      var track = document.getElementById('carousel-' + sectionId);
      if (!track || !track.firstElementChild) return;
      var idx = carouselIndex[sectionId] || 0;
      var cardWidth = track.firstElementChild.offsetWidth;
      var gap = 20;
      var step = cardWidth + gap;
      var maxIdx = Math.max(0, count - 3);
      idx = Math.min(maxIdx, Math.max(0, idx));
      carouselIndex[sectionId] = idx;
      track.style.transform = 'translateX(-' + (idx * step) + 'px)';
      var dotsEl = document.getElementById('dots-' + sectionId);
      if (dotsEl) dotsEl.querySelectorAll('button').forEach(function (b, j) { b.classList.toggle('active', j === idx); });
    }

    function bindCarouselButtons(sectionId, count) {
      var wrap = document.querySelector('.menu-carousel[data-carousel="' + sectionId + '"]');
      if (!wrap) return;
      var prev = wrap.querySelector('.menu-carousel__btn--prev');
      var next = wrap.querySelector('.menu-carousel__btn--next');
      var maxIdx = Math.max(0, count - 3);
      if (prev) prev.addEventListener('click', function () {
        carouselIndex[sectionId] = Math.max(0, (carouselIndex[sectionId] || 0) - 1);
        updateCarouselTransform(sectionId, count);
        var dotsEl = document.getElementById('dots-' + sectionId);
        if (dotsEl) dotsEl.querySelectorAll('button').forEach(function (b, j) { b.classList.toggle('active', j === carouselIndex[sectionId]); });
      });
      if (next) next.addEventListener('click', function () {
        carouselIndex[sectionId] = Math.min(maxIdx, (carouselIndex[sectionId] || 0) + 1);
        updateCarouselTransform(sectionId, count);
        var dotsEl = document.getElementById('dots-' + sectionId);
        if (dotsEl) dotsEl.querySelectorAll('button').forEach(function (b, j) { b.classList.toggle('active', j === carouselIndex[sectionId]); });
      });
    }

    function showSection(sectionId) {
      document.querySelectorAll('.menu-tabs-dark__link').forEach(function (a) {
        a.classList.toggle('menu-tabs-dark__link--active', a.getAttribute('data-tab') === sectionId);
      });
      ['platters', 'entree', 'main-soup', 'deep-fried-chicken', 'side-menu', 'bbq-range'].forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) sec.setAttribute('data-collapsed', id !== sectionId ? 'true' : 'false');
      });
      updateHero(sectionId);
    }

    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('.menu-tabs-dark__link[data-tab]');
      if (!a) return;
      e.preventDefault();
      var id = a.getAttribute('data-tab');
      showSection(id);
      var track = document.getElementById('carousel-' + id);
      if (track && track.children.length === 0) {
        if (id === 'platters' && window.__plattersData && window.__plattersData.length) {
          renderSectionCarousel('platters', window.__plattersData);
          bindCarouselButtons('platters', window.__plattersData.length);
        } else {
          var nameBySection = { 'entree': 'Entrée', 'main-soup': 'Main & Soup', 'deep-fried-chicken': 'Deep Fried Chicken', 'side-menu': 'Side Menu', 'bbq-range': 'BBQ Range' };
          var catId = categoryIdByName[nameBySection[id]];
          if (catId) {
            fetch(API_BASE + '/api/menu-items?categoryId=' + catId)
              .then(function (r) { return r.json(); })
              .then(function (items) {
                var list = items || [];
                renderSectionCarousel(id, list);
                bindCarouselButtons(id, list.length);
              })
              .catch(function () {});
          }
        }
      }
    });

    Promise.all([
      fetch(API_BASE + '/api/categories').then(function (r) { return r.json(); }),
      fetch(API_BASE + '/api/platters').then(function (r) { return r.json(); })
    ]).then(function (results) {
      var categories = results[0] || [];
      var platters = results[1] || [];
      var plattersData = platters;
      function mockPlatters() {
        return [
          { name: 'Platter A (Beef Lovers)', description: 'Galbi, Bulgogi, Brisket, banchan', price: 89 },
          { name: 'Platter B (Pork & Beef)', description: 'Pork Belly, Bulgogi, Spicy Pork', price: 79 },
          { name: 'Platter C (Sea & Land)', description: 'Beef, prawns, squid, salad', price: 85 },
          { name: 'Platter D (Chef\'s Choice)', description: 'Daily premium selection', price: 98 },
          { name: 'Platter E (Family Set)', description: 'Beef, pork, chicken, rice & soup', price: 99 }
        ];
      }
      if (!platters.length) platters = mockPlatters();
      categories.forEach(function (c) { categoryIdByName[c.name] = c.id; });
      window.__plattersData = platters;

      renderSectionCarousel('platters', platters);
      bindCarouselButtons('platters', platters.length);

      function loadAndRender(sectionId, catName) {
        var catId = categoryIdByName[catName];
        if (!catId) return;
        fetch(API_BASE + '/api/menu-items?categoryId=' + catId)
          .then(function (r) { return r.json(); })
          .then(function (items) {
            renderSectionCarousel(sectionId, items || []);
            bindCarouselButtons(sectionId, (items || []).length);
          })
          .catch(function () {});
      }

      loadAndRender('main-soup', 'Main & Soup');
      showSection('main-soup');
    }).catch(function () {
      var plats = [
        { name: 'Platter A (Beef Lovers)', description: 'Galbi, Bulgogi, Brisket, banchan', price: 89 },
        { name: 'Platter B (Pork & Beef)', description: 'Pork Belly, Bulgogi, Spicy Pork', price: 79 },
        { name: 'Platter C (Sea & Land)', description: 'Beef, prawns, squid, salad', price: 85 }
      ];
      window.__plattersData = plats;
      renderSectionCarousel('platters', plats);
      bindCarouselButtons('platters', plats.length);
      showSection('main-soup');
      var mockItems = [
        { name: 'Kimchi Jjigae', description: 'Stew with aged kimchi, tofu, pork', price: 16 },
        { name: 'Doenjang Jjigae', description: 'Soybean paste stew with tofu and veg', price: 15 },
        { name: 'Bibimbap', description: 'Rice with assorted toppings and gochujang', price: 17 }
      ];
      renderSectionCarousel('main-soup', mockItems);
      bindCarouselButtons('main-soup', mockItems.length);
    });
  } else if (isMenuPage) {
    // Legacy light menu page (if menu-page but not menu-page--dark)
    var API_BASE = 'http://localhost:8080';
    var categoryIdByName = {};
    var imageByName = {
      'Galbi': 'https://images.unsplash.com/photo-1604908812551-e3d8b80b9a1c?q=80&w=1600&auto=format&fit=crop',
      'Bulgogi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop',
      'Kimchi Jjigae': 'https://images.unsplash.com/photo-1642178653831-6d7da2c2f6d6?q=80&w=1600&auto=format&fit=crop',
      'Bibimbap': 'https://images.unsplash.com/photo-1598143123873-9400870b6155?q=80&w=1600&auto=format&fit=crop',
      'Kimchi Pancake': 'https://images.unsplash.com/photo-1648632897823-6f8a784b2ac4?q=80&w=1600&auto=format&fit=crop',
      'Japchae': 'https://images.unsplash.com/photo-1617093727343-374ea68aa608?q=80&w=1600&auto=format&fit=crop',
      'Original Fried Chicken': 'https://images.unsplash.com/photo-1604908176997-431c6d53295d?q=80&w=1600&auto=format&fit=crop',
      'Steamed Rice': 'https://images.unsplash.com/photo-1604908554700-8dc10078a7b1?q=80&w=1600&auto=format&fit=crop',
      'Kimchi': 'https://images.unsplash.com/photo-1617093727304-8c443eb0cf4b?q=80&w=1600&auto=format&fit=crop'
    };
    function imgFor(name) { return imageByName[name] || 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1600&auto=format&fit=crop'; }
    function createDishRow(item) {
      var row = document.createElement('div');
      row.className = 'dish-row';
      row.innerHTML = '<img class="dish-thumb" alt="' + item.name + '" loading="lazy" src="' + imgFor(item.name) + '"/><div class="dish-body"><h3>' + item.name + '</h3>' + (item.description ? '<p>' + item.description + '</p>' : '') + '</div><div class="dish-price">$' + Number(item.price).toFixed(2) + '</div>';
      return row;
    }
    function renderCategoryGrid(gridId, items) {
      var grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';
      (items || []).forEach(function (it) { grid.appendChild(createDishRow(it)); });
    }
    function renderPlattersList(platters) {
      var grid = document.getElementById('grid-platters');
      if (!grid) return;
      grid.innerHTML = '';
      (platters || []).forEach(function (p) { grid.appendChild(createDishRow(p)); });
    }
    function showSection(sectionId) {
      document.querySelectorAll('.menu-categories a[data-tab]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-tab') === sectionId); });
      ['platters', 'entree', 'main-soup', 'deep-fried-chicken', 'side-menu', 'bbq-range'].forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) sec.setAttribute('data-collapsed', id === sectionId ? 'false' : 'true');
      });
    }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('.menu-categories a[data-tab]');
      if (!a) return;
      e.preventDefault();
      showSection(a.getAttribute('data-tab'));
    });
    Promise.all([
      fetch(API_BASE + '/api/categories').then(function (r) { return r.json(); }),
      fetch(API_BASE + '/api/platters').then(function (r) { return r.json(); })
    ]).then(function (results) {
      var categories = results[0] || [];
      var platters = results[1] || [];
      categories.forEach(function (c) { categoryIdByName[c.name] = c.id; });
      if (!platters.length) platters = [{ name: 'Platter A', description: 'Beef Lovers', price: 89 }, { name: 'Platter B', description: 'Pork & Beef', price: 79 }];
      renderPlattersList(platters);
      function loadCat(name, gridId) {
        var id = categoryIdByName[name];
        if (!id) return;
        fetch(API_BASE + '/api/menu-items?categoryId=' + id).then(function (r) { return r.json(); }).then(function (items) { renderCategoryGrid(gridId, items || []); }).catch(function () {});
      }
      loadCat('Entrée', 'grid-entree');
      showSection('entree');
    }).catch(function () { showSection('entree'); });
  }
})();


