document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shorten-form');
  const originalUrlInput = document.getElementById('original-url');
  const customAliasInput = document.getElementById('custom-alias');
  const expiresAtInput = document.getElementById('expires-at');
  
  const optionsToggle = document.getElementById('options-toggle');
  const advancedOptions = document.getElementById('advanced-options');
  
  const stateLayer = document.getElementById('state-layer');
  const stateLoading = document.getElementById('loading');
  const stateResult = document.getElementById('result-container');
  const stateError = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  
  const shortUrlLink = document.getElementById('short-url-link');
  const copyBtn = document.getElementById('copy-btn');
  const viewStatsBtn = document.getElementById('view-stats-btn');
  
  const statsModal = document.getElementById('stats-modal');
  const closeBtn = document.querySelector('.modal-close');
  
  const recentLinksSection = document.getElementById('recent-links-section');
  const linksList = document.getElementById('links-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  
  const qrCodeImg = document.getElementById('qr-code-img');
  
  let currentShortCode = '';

  // Theme Management
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('nexus_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexus_theme', newTheme);
  });

  const getDisplayDomain = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'snap.url' 
      : window.location.host;
  };

  // Local Storage Management
  const getHistory = () => JSON.parse(localStorage.getItem('nexus_history') || '[]');
  const saveHistory = (history) => localStorage.setItem('nexus_history', JSON.stringify(history));
  
  const addToHistory = (code, originalUrl) => {
    const history = getHistory();
    const filtered = history.filter(item => item.code !== code);
    filtered.unshift({ code, originalUrl, date: new Date().toISOString() });
    saveHistory(filtered.slice(0, 10));
    renderHistory();
  };

  const clearHistory = () => {
    localStorage.removeItem('nexus_history');
    renderHistory();
  };

  const renderHistory = () => {
    const history = getHistory();
    if (history.length === 0) {
      recentLinksSection.classList.add('hidden');
      return;
    }
    
    const displayDomain = getDisplayDomain();
    
    recentLinksSection.classList.remove('hidden');
    linksList.innerHTML = history.map(item => `
      <div class="history-item">
        <div class="history-details">
          <a href="/${item.code}" target="_blank" class="history-short">${displayDomain}/${item.code}</a>
          <span class="history-original" title="${item.originalUrl}">${item.originalUrl}</span>
        </div>
        <div class="history-actions">
          <button class="icon-btn copy-history" data-url="${window.location.origin}/${item.code}" aria-label="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <button class="icon-btn stats-history" data-code="${item.code}" aria-label="Stats">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </button>
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.copy-history').forEach(btn => {
      btn.addEventListener('click', (e) => handleCopy(btn.dataset.url, btn));
    });
    
    document.querySelectorAll('.stats-history').forEach(btn => {
      btn.addEventListener('click', () => openStats(btn.dataset.code));
    });
  };

  renderHistory();
  clearHistoryBtn.addEventListener('click', clearHistory);

  optionsToggle.addEventListener('click', () => {
    optionsToggle.classList.toggle('active');
    advancedOptions.classList.toggle('open');
  });
  
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  expiresAtInput.min = now.toISOString().slice(0,16);

  const showState = (stateElement) => {
    [stateLoading, stateResult, stateError].forEach(el => el.classList.add('hidden'));
    if (stateElement) {
      stateElement.classList.remove('hidden');
    }
  };

  const renderQRCode = (url) => {
    // Generate QR code using API for 100% reliability
    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=09090b&bgcolor=ffffff`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const originalUrl = originalUrlInput.value.trim();
    let customAlias = customAliasInput.value.trim();
    let expiresAt = expiresAtInput.value;
    
    if (customAlias.startsWith('/')) customAlias = customAlias.substring(1);

    showState(stateLoading);
    
    try {
      const payload = { original_url: originalUrl };
      if (customAlias) payload.custom_alias = customAlias;
      if (expiresAt) {
        payload.expires_at = new Date(expiresAt).toISOString();
      }

      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL.');
      }

      currentShortCode = data.code;
      const actualShortUrl = `${window.location.origin}/${data.code}`;
      const displayDomain = getDisplayDomain();
      
      shortUrlLink.href = actualShortUrl;
      shortUrlLink.textContent = `${displayDomain}/${data.code}`;
      
      renderQRCode(actualShortUrl);
      addToHistory(data.code, originalUrl);
      
      originalUrlInput.value = '';
      customAliasInput.value = '';
      expiresAtInput.value = '';
      if (advancedOptions.classList.contains('open')) {
        optionsToggle.click();
      }
      
      showState(stateResult);

    } catch (err) {
      errorText.textContent = err.message;
      showState(stateError);
    }
  });

  const handleCopy = async (text, buttonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = buttonElement.innerHTML;
      
      if (buttonElement.id === 'copy-btn') {
        buttonElement.classList.add('copied');
        buttonElement.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied!</span>
        `;
      } else {
        buttonElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      }
      
      setTimeout(() => {
        buttonElement.classList.remove('copied');
        buttonElement.innerHTML = originalHTML;
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  copyBtn.addEventListener('click', () => {
    handleCopy(shortUrlLink.href, copyBtn);
  });

  const openStats = async (code) => {
    try {
      const response = await fetch(`/api/urls/${code}/analytics`);
      if (!response.ok) throw new Error('Analytics not found');
      
      const data = await response.json();
      
      const displayDomain = getDisplayDomain();
      document.getElementById('stat-shortcode').textContent = `${displayDomain}/${code}`;
      document.getElementById('stat-clicks').textContent = data.clicks;
      
      const date = new Date(data.created_at);
      document.getElementById('stat-created').textContent = date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      
      statsModal.classList.remove('hidden');
    } catch (err) {
      alert('Could not load statistics. Link may have expired or does not exist.');
    }
  };

  viewStatsBtn.addEventListener('click', () => {
    if (currentShortCode) openStats(currentShortCode);
  });

  // Close Modal Handling
  const closeModal = () => statsModal.classList.add('hidden');
  
  closeBtn.addEventListener('click', closeModal);
  statsModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !statsModal.classList.contains('hidden')) closeModal();
  });
});
