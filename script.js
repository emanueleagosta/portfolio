document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');
  const grid = document.querySelector('.project-grid');

  // --- Filter logic ---
  if (filterButtons.length && grid) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        refreshFilter();
      });
    });

    // Trigger initial filter
    const defaultFilter = document.querySelector('.filter-pill.active');
    if (defaultFilter) {
      defaultFilter.click();
    }
  }

  // --- About panel toggle ---
  const aboutToggle = document.getElementById('about-toggle');
  const aboutPanel = document.getElementById('about-panel');
  const aboutBackdrop = document.getElementById('about-backdrop');
  const aboutCloseBtn = document.getElementById('about-close');

  if (aboutToggle && aboutPanel && aboutBackdrop) {
    function openAbout() {
      aboutPanel.classList.add('open');
      aboutBackdrop.classList.add('open');
      aboutToggle.classList.add('active');
      aboutPanel.setAttribute('aria-hidden', 'false');
    }

    function closeAbout() {
      aboutPanel.classList.remove('open');
      aboutBackdrop.classList.remove('open');
      aboutToggle.classList.remove('active');
      aboutPanel.setAttribute('aria-hidden', 'true');
    }

    aboutToggle.addEventListener('click', () => {
      const isOpen = aboutPanel.classList.contains('open');
      if (isOpen) {
        closeAbout();
      } else {
        openAbout();
      }
    });

    // Close on backdrop click
    aboutBackdrop.addEventListener('click', closeAbout);

    // Close on X button click
    if (aboutCloseBtn) {
      aboutCloseBtn.addEventListener('click', closeAbout);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aboutPanel.classList.contains('open')) {
        closeAbout();
      }
    });
  }

  // --- Dynamic Articles from Create with Swift ---
  const AUTHOR_URL = 'https://www.createwithswift.com/author/emanueleagosta/';
  const CORS_PROXY = 'https://corsproxy.io/?';

  async function fetchPage(url) {
    const response = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }

  function parseArticles(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cards = doc.querySelectorAll('article.post-card');
    const articles = [];

    cards.forEach(card => {
      const linkEl = card.querySelector('a.post-card-content-link') || card.querySelector('a');
      const imgEl = card.querySelector('img.post-card-image') || card.querySelector('img');
      const tagEl = card.querySelector('.post-card-primary-tag');
      const titleEl = card.querySelector('h2.post-card-title');
      const excerptEl = card.querySelector('.post-card-excerpt p') || card.querySelector('.post-card-excerpt');

      if (!titleEl) return;

      // Helper to fix relative URLs
      const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Check if it's protocol-relative or root-relative
        if (url.startsWith('//')) return 'https:' + url;
        if (url.startsWith('/')) return 'https://www.createwithswift.com' + url;
        return url;
      };

      const rawLink = linkEl ? linkEl.getAttribute('href') : '#';
      const rawImg = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('srcset')?.split(' ')[0]) : ''; // Try src, fallback to first srcset

      articles.push({
        url: resolveUrl(rawLink),
        image: resolveUrl(rawImg),
        category: tagEl ? tagEl.textContent.trim() : '',
        title: titleEl.textContent.trim(),
        subtitle: excerptEl ? excerptEl.textContent.trim() : ''
      });
    });

    return articles;
  }

  function hasNextPage(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return !!doc.querySelector('a[aria-label="Next page"], .pagination .next, a.pagination-next');
  }

  function renderArticles(articles) {
    const container = document.getElementById('articles-container');
    const fallback = document.getElementById('articles-fallback');
    if (!container) return;

    // Clear skeletons
    container.innerHTML = '';

    articles.forEach((article, i) => {
      const card = document.createElement('a');
      card.href = article.url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'project-card small-card';
      card.dataset.category = 'articles';

      // Initial hidden state for animation
      card.style.display = 'none';
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';

      card.innerHTML = `
        <div class="project-thumbnail">
          ${article.category ? `<span class="card-pill">${article.category}</span>` : ''}
          <img src="${article.image}" alt="${article.title}" class="thumbnail-img" loading="lazy">
        </div>
        <div class="project-info">
          <h3 class="project-title">${article.title}</h3>
          <p class="project-subtitle">${article.subtitle}</p>
        </div>
      `;

      container.appendChild(card);
    });

    // Re-trigger the active filter to register new cards
    refreshFilter();
  }

  function refreshFilter() {
    // Re-query all project cards including dynamically added ones
    const allCards = document.querySelectorAll('.project-card');
    const activeFilter = document.querySelector('.filter-pill.active');

    if (!activeFilter || !grid) return;

    const filter = activeFilter.dataset.filter;

    allCards.forEach(card => {
      // Ensure transition is set for animation
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      if (card.dataset.category === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    // Adjust grid columns for articles and talks via CSS class
    if (filter === 'articles' || filter === 'talks') {
      grid.classList.add('grid-4col');
    } else {
      grid.classList.remove('grid-4col');
    }

    // Collect visible cards and stagger their animation
    const visibleCards = [...allCards].filter(c => c.dataset.category === filter);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        visibleCards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 0.04}s`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        // Clear delays after animation completes
        setTimeout(() => {
          visibleCards.forEach(card => {
            card.style.transitionDelay = '';
          });
        }, visibleCards.length * 40 + 400);
      });
    });
  }

  async function loadArticles() {
    try {
      // Fetch page 1
      const html1 = await fetchPage(AUTHOR_URL);
      let allArticles = parseArticles(html1);

      // Check for additional pages
      if (hasNextPage(html1)) {
        try {
          const html2 = await fetchPage(AUTHOR_URL + 'page/2/');
          const page2Articles = parseArticles(html2);
          allArticles = allArticles.concat(page2Articles);

          // Check for page 3
          if (hasNextPage(html2)) {
            try {
              const html3 = await fetchPage(AUTHOR_URL + 'page/3/');
              allArticles = allArticles.concat(parseArticles(html3));
            } catch (e) { /* page 3 optional */ }
          }
        } catch (e) { /* page 2 optional */ }
      }

      if (allArticles.length > 0) {
        renderArticles(allArticles);
      } else {
        throw new Error('No articles found');
      }
    } catch (error) {
      console.warn('Failed to load articles:', error);
      // Show fallback
      const container = document.getElementById('articles-container');
      const fallback = document.getElementById('articles-fallback');
      if (container) container.innerHTML = '';
      if (fallback) fallback.style.display = '';
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      refreshFilter();
    });
  });

  // Load articles
  loadArticles();
});
