document.addEventListener('DOMContentLoaded', () => {
  // SPA Router
  const views = document.querySelectorAll('.spa-view');
  const navLinks = document.querySelectorAll('.nav-spa-link');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');

  function handleRoute() {
    const hash = window.location.hash || '#home';
    let targetViewId = 'home-view';

    // Map hash to view ID
    if (hash !== '#home' && hash.startsWith('#/')) {
      targetViewId = hash.replace('#/', '') + '-view';
    } else if (hash.startsWith('#')) {
      const simpleHash = hash.replace('#', '');
      const possibleView = document.getElementById(simpleHash + '-view');
      if (possibleView) {
        targetViewId = simpleHash + '-view';
      }
    }

    const targetView = document.getElementById(targetViewId);

    if (targetView) {
      views.forEach(view => {
        view.classList.remove('active-view');
        view.classList.add('hidden-view');
      });

      targetView.classList.remove('hidden-view');
      targetView.classList.add('active-view');

      // Scroll to correct position on transition
      if (hash.startsWith('#') && !hash.startsWith('#/')) {
        const targetAnchor = document.getElementById(hash.substring(1));
        if (targetAnchor) {
          setTimeout(() => {
            targetAnchor.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Re-trigger AOS animations for elements inside the newly active view
      if (typeof AOS !== 'undefined') {
        setTimeout(() => {
          AOS.refresh();
        }, 100);
      }
    }

    // Update nav links active states
    updateActiveNav(hash);
  }

  function updateActiveNav(currentHash) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentHash || (currentHash === '#home' && href === '#/home')) {
        link.classList.add('text-yellow-400');
        link.classList.remove('text-zinc-300');
      } else {
        link.classList.remove('text-yellow-400');
        link.classList.add('text-zinc-300');
      }
    });
  }

  // Event Listeners for hash change
  window.addEventListener('hashchange', handleRoute);
  
  // Initial routing
  handleRoute();

  // Mobile Menu Toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active', isOpen);
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // Sticky header background transition on scroll & progress bar update
  const header = document.querySelector('header');
  const progressBar = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    // Scroll progress bar
    if (progressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }

    if (window.scrollY > 50) {
      header.classList.add('glass-nav', 'py-4');
      header.classList.remove('bg-transparent', 'py-6');
    } else {
      header.classList.remove('glass-nav', 'py-4');
      header.classList.add('bg-transparent', 'py-6');
    }
  });

  // Smooth scroll helper for non-SPA anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && !href.startsWith('#/')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Contact Form Submission (Mock)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      setTimeout(() => {
        submitBtn.innerHTML = 'Mensagem Enviada com Sucesso!';
        submitBtn.classList.remove('bg-yellow-400', 'text-black');
        submitBtn.classList.add('bg-green-600', 'text-white');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('bg-green-600', 'text-white');
          submitBtn.classList.add('bg-yellow-400', 'text-black');
        }, 3000);
      }, 1500);
    });
  }

  // Light/Dark Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeIcon(true);
    }

    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });

    function updateThemeIcon(isLight) {
      const icon = themeToggleBtn.querySelector('svg');
      if (isLight) {
        // SVG for Moon icon (show when in light mode to suggest switching to dark)
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
        themeToggleBtn.setAttribute('aria-label', 'Mudar para modo escuro');
      } else {
        // SVG for Sun icon (show when in dark mode to suggest switching to light)
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />`;
      }
    }
  }

  // Stats Counter Animation
  const counters = document.querySelectorAll('.dynamic-counter');
  const counterSpeed = 60; // Lower is faster

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const textFormat = counter.innerText;
    let count = 0;
    
    // Smooth step sizes
    const increment = Math.max(Math.ceil(target / counterSpeed), 1);
    
    const updateCount = () => {
      count += increment;
      if (count < target) {
        if (textFormat.includes('%')) {
          counter.innerText = `${count}%`;
        } else if (textFormat.includes('M+')) {
          counter.innerText = `${count}M+`;
        } else if (textFormat.includes('+')) {
          counter.innerText = `+${count}`;
        } else {
          counter.innerText = count;
        }
        setTimeout(updateCount, 25);
      } else {
        counter.innerText = textFormat.replace(/[0-9]+/, target);
      }
    };
    updateCount();
  };

  // Intersection Observer for Stats
  const firstCounter = document.querySelector('.dynamic-counter');
  if (firstCounter && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.25,
      rootMargin: "0px 0px -50px 0px"
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => startCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(firstCounter.parentElement.parentElement);
  } else if (firstCounter) {
    // Fallback for older browsers
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      counter.innerText = counter.innerText.replace(/[0-9]+/, target);
    });
  }

  // --- BLOG ENGINE ---
  const defaultArticles = [
    {
      id: 1,
      title: "Como o Marketing de Conteúdo Constrói Autoridades em 2026",
      category: "Marketing de Conteúdo",
      summary: "Entenda por que produzir conteúdo estratégico e refinado continua sendo o maior ativo para posicionar marcas de elite no mercado digital atual.",
      content: "No cenário atual de 2026, onde a inteligência artificial automatizou a criação de conteúdos genéricos, a diferenciação reside na autenticidade, profundidade e personalização. Marcas que desejam se destacar como autoridades precisam abandonar o óbvio e investir em conteúdo que realmente resolva problemas complexos de seu público.\n\nO marketing de conteúdo moderno não se resume a publicar postagens diárias sem um propósito claro. Ele exige uma análise aprofundada dos pontos de dor da persona, uma narrativa sofisticada e um design visual condizente com o nível de qualidade da empresa.\n\nNa .panda, acreditamos que cada artigo, newsletter ou e-book produzido deve funcionar como um embaixador da sua marca. Construir autoridade requer consistência, excelência técnica e, acima de tudo, o toque humano que gera conexão e confiança genuínas. Planeje seus temas, refine sua voz de marca e veja os leads qualificados escolherem sua empresa de forma orgânica.",
      date: "15 Jun 2026"
    }
  ];

  // Retrieve or initialize articles
  let articles = JSON.parse(localStorage.getItem('panda_blog_articles'));
  if (!articles || articles.length === 0) {
    articles = defaultArticles;
    localStorage.setItem('panda_blog_articles', JSON.stringify(articles));
  }

  // DOM Elements
  const blogGrid = document.getElementById('blog-grid');
  const blogArticlesTabContent = document.getElementById('blog-articles-tab');
  const blogReadingPane = document.getElementById('blog-reading-pane');
  const blogBackToGrid = document.getElementById('blog-back-to-grid');
  
  const readArticleTitle = document.getElementById('read-article-title');
  const readArticleDate = document.getElementById('read-article-date');
  const readArticleCategory = document.getElementById('read-article-category');
  const readArticleContent = document.getElementById('read-article-content');

  // Render Grid
  function renderBlogArticles() {
    if (!blogGrid) return;
    blogGrid.innerHTML = '';
    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'glass-panel glass-card-hover rounded-t-[2rem] rounded-b-[1rem] p-6 flex flex-col justify-between h-[380px] border-t-2 border-t-brand-yellow/30 cursor-pointer';
      card.addEventListener('click', () => showArticle(article.id));
      
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow">${article.category}</span>
            <span class="text-xs text-zinc-500">${article.date}</span>
          </div>
          <h3 class="text-lg font-bold font-display text-white mb-3 tracking-tight hover:text-brand-yellow transition-colors line-clamp-2">${article.title}</h3>
          <p class="text-zinc-400 text-xs leading-relaxed line-clamp-4">${article.summary}</p>
        </div>
        <div class="pt-4 border-t border-zinc-900/60 mt-auto flex items-center justify-between">
          <span class="inline-flex items-center text-brand-yellow text-xs font-bold hover:text-white transition-colors duration-200">
            Ler Artigo Completo
            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </span>
        </div>
      `;
      blogGrid.appendChild(card);
    });
  }

  // Show Article details (Reading Pane)
  function showArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    readArticleTitle.innerText = article.title;
    readArticleDate.innerText = article.date;
    readArticleCategory.innerText = article.category;
    
    // Formatting newlines as paragraphs
    const paragraphs = article.content.split('\n\n');
    readArticleContent.innerHTML = paragraphs.map(p => `<p class="mb-4">${p.replace(/\n/g, '<br>')}</p>`).join('');

    // Toggle panes
    blogArticlesTabContent.classList.add('hidden');
    blogReadingPane.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Back button in reading pane
  if (blogBackToGrid) {
    blogBackToGrid.addEventListener('click', () => {
      blogReadingPane.classList.add('hidden');
      blogArticlesTabContent.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial Blog render
  renderBlogArticles();

  // --- SERVICES SEARCH & FILTER ENGINE ---
  const servicesSearch = document.getElementById('services-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-item-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterServices() {
    serviceCards.forEach(card => {
      const cardCategories = card.getAttribute('data-categories').split(' ');
      const cardKeywords = card.getAttribute('data-keywords').toLowerCase();
      const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const cardDescription = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
      
      const matchesCategory = activeCategory === 'all' || cardCategories.includes(activeCategory);
      const matchesSearch = cardKeywords.includes(searchQuery) || 
                            cardTitle.includes(searchQuery) || 
                            cardDescription.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  if (servicesSearch) {
    servicesSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterServices();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-brand-yellow', 'text-brand-black', 'border-brand-yellow');
        b.classList.add('bg-zinc-900', 'text-zinc-300', 'border-zinc-800', 'hover:border-zinc-700');
      });
      btn.classList.add('bg-brand-yellow', 'text-brand-black', 'border-brand-yellow');
      btn.classList.remove('bg-zinc-900', 'text-zinc-300', 'border-zinc-800', 'hover:border-zinc-700');

      activeCategory = btn.getAttribute('data-category');
      filterServices();
    });
  });

  // --- COURSES ACCORDION / TOGGLE ---
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    const btn = card.querySelector('.course-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isExpanded = card.classList.toggle('is-expanded');
        
        // Update button text and icon orientation if needed
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('.btn-icon');
        
        if (btnText) {
          btnText.textContent = isExpanded ? 'Ver Menos' : 'Saiba Mais';
        }
        if (btnIcon) {
          if (isExpanded) {
            btnIcon.classList.add('rotate-180');
          } else {
            btnIcon.classList.remove('rotate-180');
          }
        }
      });
    }
  });

  // --- WHATSAPP WIDGET LOGIC ---
  const whatsappTrigger = document.getElementById('whatsapp-trigger');
  const whatsappChatBox = document.getElementById('whatsapp-chat-box');
  const whatsappCloseBtn = document.getElementById('whatsapp-close-btn');
  const whatsappOptBtns = document.querySelectorAll('.whatsapp-opt-btn');

  if (whatsappTrigger && whatsappChatBox) {
    // Toggle Chat Window
    whatsappTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsappChatBox.classList.toggle('active');
    });

    // Close Chat Window
    if (whatsappCloseBtn) {
      whatsappCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        whatsappChatBox.classList.remove('active');
      });
    }

    // Click Outside to Close
    document.addEventListener('click', (e) => {
      if (!whatsappChatBox.contains(e.target) && !whatsappTrigger.contains(e.target)) {
        whatsappChatBox.classList.remove('active');
      }
    });

    // Option Click - redirect with pre-filled message
    whatsappOptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-msg');
        const phoneNumber = '5511941704898';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        whatsappChatBox.classList.remove('active');
      });
    });
  }

  // --- NAVIGATION STYLE TOGGLER ---
  const toggleNavBtn = document.getElementById('toggle-nav-style-btn');
  
  // Load saved navigation preference
  const savedNavMode = localStorage.getItem('nav-style-mode');
  if (savedNavMode === 'floating') {
    document.body.classList.add('nav-floating-mode');
  }

  if (toggleNavBtn) {
    toggleNavBtn.addEventListener('click', () => {
      const isFloating = document.body.classList.toggle('nav-floating-mode');
      localStorage.setItem('nav-style-mode', isFloating ? 'floating' : 'default');
    });
  }
});


