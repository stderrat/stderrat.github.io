// Extracted from layouts/shortcodes/gitops-catalog.html so the page works with a CSP without 'unsafe-inline'.
(function() {
  'use strict';
  
  const catalog = document.querySelector('.gitops-catalog');
  if (!catalog) return;
  
  const searchInput = catalog.querySelector('#gitops-search');
  const filterBtns = catalog.querySelectorAll('.gitops-filter-btn');
  const cards = catalog.querySelectorAll('.gitops-app-card');
  const noResults = catalog.querySelector('.gitops-no-results');
  
  let activeCategory = 'all';
  let searchTerm = '';
  
  function filterCards() {
    let visibleCount = 0;
    
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardName = card.dataset.name;
      const cardDescription = card.dataset.description;
      const cardKeywords = card.dataset.keywords;
      
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = searchTerm === '' || 
        cardName.includes(searchTerm) || 
        cardDescription.includes(searchTerm) ||
        cardKeywords.includes(searchTerm);
      
      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        card.classList.add('gitops-card-visible');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('gitops-card-visible');
      }
    });
    
    noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
  }
  
  // Category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterCards();
    });
  });
  
  // Search input
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterCards();
  });
  
  // Initialize
  filterCards();
  
  // Handle clicking on app dependency links (scroll to that app)
  catalog.querySelectorAll('.gitops-dep-app').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const appId = link.dataset.appId;
      const targetCard = catalog.querySelector(`.gitops-app-card[data-category][data-name*="${appId.toLowerCase()}"]`) ||
                         catalog.querySelector(`.gitops-app-card[data-keywords*="${appId}"]`);
      
      if (targetCard) {
        // Reset filters to show all
        filterBtns.forEach(b => b.classList.remove('active'));
        catalog.querySelector('[data-category="all"]').classList.add('active');
        activeCategory = 'all';
        searchTerm = '';
        searchInput.value = '';
        filterCards();
        
        // Scroll to and highlight the target card
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.classList.add('gitops-card-highlight');
        setTimeout(() => targetCard.classList.remove('gitops-card-highlight'), 2000);
      }
    });
  });
})();
