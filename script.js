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
  // Ghost Content API: public, CORS-enabled, JSON, single request — no proxies needed
  const GHOST_API = 'https://create-with-swift.ghost.io/ghost/api/content/posts/';
  const GHOST_KEY = 'b69d3c353eb5dc4c23659ee250';

  // Hardcoded fallback — loads instantly if API unreachable
  const FALLBACK_ARTICLES = [
    { title: "Exploring a new visual language: Liquid Glass", url: "https://www.createwithswift.com/exploring-a-new-visual-language-liquid-glass/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2025/06/createwithswift.com-exploring-a-new-visual-language-liquid-glass-01.png", category: "App Design", subtitle: "Understand Apple\u2019s new design language and learn how to use it." },
    { title: "WWDC 2025: What\u2019s new for the Apple community?", url: "https://www.createwithswift.com/wwdc-2025-whats-new-for-the-apple-community/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2025/06/createwithswift.com-wwdc-2025-whats-new-for-the-apple-community.jpg", category: "WWDC", subtitle: "This article covers the most inspiring new releases from WWDC 2025 and showcases some of our highlights from the developer conference." },
    { title: "Discovering Camera Control", url: "https://www.createwithswift.com/discovering-camera-control/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/09/createwithswift.com-discovering-camera-control-01.png", category: "UX Design", subtitle: "Understanding the shift in user interaction dynamics." },
    { title: "Creating advanced hover effects in visionOS", url: "https://www.createwithswift.com/creating-advanced-hover-effects-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/06/createwithswift.com-creating-advanced-hover-effects-in-visionOS01.gif", category: "visionOS", subtitle: "Learn how to create great hover effect experiences for visionOS applications." },
    { title: "WWDC24: What\u2019s new in the Human Interface Guidelines", url: "https://www.createwithswift.com/wwdc24-whats-new-in-the-human-interface-guidelines/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/06/createwithswift.com-wwdc24-whats-new-in-the-human-interface-guidelines.png", category: "WWDC", subtitle: "Discover and navigate the WWDC24 updates to the Human Interface Guidelines." },
    { title: "Creating custom buttons and hover effects in visionOS", url: "https://www.createwithswift.com/creating-custom-buttons-and-hover-effects-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/05/createwithswift.com-creating-custom-buttons-and-hover-effects-in-visionOS.gif", category: "visionOS", subtitle: "Use hover effects and visual feedback to enhance your app\u2019s interactivity with system and custom buttons." },
    { title: "Understanding typography in visionOS", url: "https://www.createwithswift.com/understanding-typography-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/05/createwithswift.com-understanding-typography-in-visionOS-01.png", category: "visionOS", subtitle: "Optimize text readability in visionOS leveraging font, color, and vibrancy" },
    { title: "Exploring immersive spaces in visionOS", url: "https://www.createwithswift.com/exploring-immersive-spaces-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/05/createwithswift.com-exploring-immersive-spaces-in-visionOS-01.png", category: "Spatial Computing", subtitle: "Learn how to create immersive spaces with SwiftUI for a visionOS app" },
    { title: "Understanding real-world sizes for visionOS", url: "https://www.createwithswift.com/understanding-real-world-sizes-for-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/03/createwithswift.com-understanding-real-world-sizes-for-visionos-01-8.gif", category: "visionOS", subtitle: "Learn how to convert meters and inches to points when designing for visionOS." },
    { title: "Ensuring interface legibility and contrast in visionOS", url: "https://www.createwithswift.com/ensuring-interface-legibility-and-contrast-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/02/createwithswift.com-ensuring-interface-legibility-and-contrast-in-visionOS.png", category: "visionOS", subtitle: "Use materials to craft spatial user interfaces, ensuring legibility and contrast." },
    { title: "Embedding 3D objects into visionOS windows", url: "https://www.createwithswift.com/embedding-3d-objects-into-visionos-windows/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/01/createwithswift.com-embedding-3D-objects-into-visionOS-windows.png", category: "visionOS", subtitle: "Enhance your visionOS app experience by seamlessly integrating 3D objects in a window." },
    { title: "Implementing volumes in visionOS", url: "https://www.createwithswift.com/implementing-volumes-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/01/createwithswift.com-implementing-volumes-in-visionOS-1.png", category: "visionOS", subtitle: "Learn how to embrace volumes for immersive 3D experiences in visionOS." },
    { title: "Implementing windows in visionOS", url: "https://www.createwithswift.com/implementing-windows-in-visionos/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/01/createwithswift.com-implementing-windows-in-visionOS.png", category: "visionOS", subtitle: "Learn the fundamentals of using windows in a visionOS application." },
    { title: "Understanding spatial awareness: immersive experiences", url: "https://www.createwithswift.com/understanding-spatial-awareness-immersive-experience/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2023/11/createwithswift.com-understanding-spatial-awareness-immersive-experience-001-1.png", category: "Spatial Computing", subtitle: "Exploring immersion spectrum, dimming, passthrough, and transitions" },
    { title: "Understanding spatial awareness: dimension", url: "https://www.createwithswift.com/understanding-spatial-awareness-dimension/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2023/11/createwithswift.com-understanding-spatial-awareness-dimension-001.png", category: "Spatial Computing", subtitle: "Learn the core principles of space, depth and scale in visionOS." },
    { title: "Designing for spatial computing: from iOS and iPadOS to visionOS", url: "https://www.createwithswift.com/designing-for-visionos-shifting-from-ios-and-ipados/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2024/05/createwithswift.com-designing-for-spatial-computing-from-iOS-iPadOS-to-visionOS-01.png", category: "Spatial Computing", subtitle: "Understand the core elements that compose a visionOS application." },
    { title: "Designing Micro-interactions to Create Seamless User Experiences", url: "https://www.createwithswift.com/designing-micro-interactions-to-create-seamless-user-experiences/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2023/03/createwithswift.com-designing-micro-interactions-to-create-seamless-user-experiences-01-1.gif", category: "UX Design", subtitle: "Explore how animation and motion impact\u00a0the UX and learn how to use micro-interactions for seamless user experiences" },
    { title: "Applying Gestalt Principles in UI/UX App Design", url: "https://www.createwithswift.com/applying-gestalt-principles-in-ui-ux-app-design/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2023/02/createwithswift.com-applying-gestalt-principles-in-ui-ux-app-design.png", category: "UX Design", subtitle: "Discover how the foundational principles of visual perception can be applied to enhance the user experience in your app." },
    { title: "Creating App Prototypes from Low to High-Fidelity", url: "https://www.createwithswift.com/creating-app-prototypes-from-low-to-high-fidelity/", image: "https://storage.ghost.io/c/74/1b/741b667e-bca4-4d4a-a324-2feaee7a1038/content/images/2023/01/createwithswift.com-app-design-process-from-low-fidelity-to-high-fidelity-1.png", category: "UX Design", subtitle: "Dive deeper into the app design process and understand how to create an intuitive user experience with low and high-fidelity prototypes." }
  ];

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

    // Hide/show articles fallback based on active filter
    const fallback = document.getElementById('articles-fallback');
    if (fallback) {
      if (filter !== 'articles') {
        fallback.style.display = 'none';
      }
      // Note: fallback display is managed by loadArticles when filter IS 'articles'
    }

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
      // Single fast JSON request — no CORS proxies, no HTML scraping
      const apiUrl = `${GHOST_API}?key=${GHOST_KEY}&filter=authors:emanueleagosta&fields=title,url,feature_image,excerpt&include=tags&limit=all`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const articles = data.posts.map(post => ({
        title: post.title,
        url: post.url,
        image: post.feature_image || '',
        category: (post.tags && post.tags.length > 0) ? post.tags[0].name : '',
        subtitle: post.excerpt || ''
      }));

      if (articles.length > 0) {
        renderArticles(articles);
      } else {
        throw new Error('No articles found');
      }
    } catch (error) {
      console.warn('Ghost API unavailable, using cached articles:', error);
      // Instant fallback — hardcoded data, zero network dependency
      renderArticles(FALLBACK_ARTICLES);
    }
  }

  // Load articles
  loadArticles();
});
