// ── Category definitions ──────────────────────────────────────────────────

const CATEGORIES = {
  people: {
    id: 'people', label: 'People', color: '#e0f2f0', iconColor: '#2ec4b6',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'
  },
  places: {
    id: 'places', label: 'Places', color: '#fef0e7', iconColor: '#ff8c42',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2L2 7h20L12 2zM4 9v10h3v-6h2v6h2v-6h2v6h2v-6h2v6h3V9H4zm17 11H3v2h18v-2z"/></svg>'
  },
  nature: {
    id: 'nature', label: 'Nature', color: '#e8f5e9', iconColor: '#4caf50',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2L4 14h5v8h6v-8h5L12 2z"/></svg>'
  },
  music: {
    id: 'music', label: 'Music', color: '#f3e8fd', iconColor: '#9c27b0',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>'
  },
  views: {
    id: 'views', label: 'Views', color: '#e8f4fd', iconColor: '#2196f3',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>'
  },
  reading: {
    id: 'reading', label: 'Reading', color: '#eee8fd', iconColor: '#7c4dff',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 2h-8C8.9 2 8 2.9 8 4v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14h-8V4h8v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>'
  }
};

const CATEGORY_ORDER = ['people', 'places', 'nature', 'music', 'views', 'reading'];
const DEFAULT_CATEGORY = 'people';
const COUNTDOWN_DURATION = 8000;

// ── Main class ────────────────────────────────────────────────────────────

class GoodThings {
  constructor() {
    this.goodThings = this.load();

    // DOM refs — login
    this.loginScreen  = document.getElementById('loginScreen');
    this.loginBtn     = document.getElementById('loginBtn');
    this.loginEmail   = document.getElementById('loginEmail');
    this.loginError   = document.getElementById('loginError');
    this.loginSent    = document.getElementById('loginSent');
    this.loginFormEl  = document.getElementById('loginForm');
    this.otpInput     = document.getElementById('otpInput');
    this.otpError     = document.getElementById('otpError');
    this.verifyBtn    = document.getElementById('verifyBtn');

    // DOM refs — main app
    this.input        = document.getElementById('goodThingInput');
    this.micBarBtn    = document.getElementById('micBarBtn');
    this.sendBarBtn   = document.getElementById('sendBarBtn');
    this.voiceStatus  = document.getElementById('voiceStatus');
    this.list         = document.getElementById('goodThingsList');
    this.emptyState   = document.getElementById('emptyState');
    this.favFilterBtn = document.getElementById('favFilterBtn');
    this.logoutBtn    = document.getElementById('logoutBtn');

    // Voice
    this.recognition = null;
    this.isListening = false;

    // UI state
    this.favFilterActive       = false;
    this.activeInfoPanelId     = null;
    this.activeCategoryPanelId = null;
    this.countdownTimer        = null;
    this.countdownStart        = null;

    // Platform detection
    this.isNative = !!(window.Capacitor?.isNativePlatform?.());
    this.isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);

    this.initApp();
  }

  // ── App init ──────────────────────────────────────────────────────────────

  async initApp() {
    const user = await AppAuth.init();

    if (!user) {
      this.showLoginScreen();
      return;
    }

    const syncedUser = localStorage.getItem('gt_synced_user');
    if (syncedUser !== user.id) {
      await AppSync.pullRemote();
      localStorage.setItem('gt_synced_user', user.id);
      this.goodThings = this.load();
    } else {
      AppSync.flushPending();
    }

    this.initSpeechRecognition();
    this.init();
    this.render();

    window.addEventListener('online', () => {
      if (AppAuth.currentUser) AppSync.flushPending();
    });
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  showLoginScreen() {
    this.loginScreen.classList.remove('hidden');

    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.loginEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });

    this.verifyBtn.addEventListener('click', () => this.handleVerify());
    this.otpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleVerify();
    });
  }

  async handleLogin() {
    const email = this.loginEmail.value.trim();
    if (!email) return;

    this.loginBtn.disabled = true;
    this.loginBtn.textContent = 'Sending...';
    this.loginError.classList.add('hidden');

    const error = await AppAuth.signIn(email);

    if (error) {
      this.loginBtn.disabled = false;
      this.loginBtn.textContent = 'Send code';
      this.loginError.textContent = error.message || 'Something went wrong. Please try again.';
      this.loginError.classList.remove('hidden');
      return;
    }

    this.loginFormEl.classList.add('hidden');
    this.loginSent.classList.remove('hidden');
    this.otpInput.focus();
  }

  async handleVerify() {
    const email = this.loginEmail.value.trim();
    const token = this.otpInput.value.trim();
    if (!token || token.length !== 6) return;

    this.verifyBtn.disabled = true;
    this.verifyBtn.textContent = 'Verifying...';
    this.otpError.classList.add('hidden');

    const { error } = await AppAuth.verifyOtp(email, token);

    if (error) {
      this.verifyBtn.disabled = false;
      this.verifyBtn.textContent = 'Verify code';
      this.otpError.textContent = error.message || 'Invalid code. Please try again.';
      this.otpError.classList.remove('hidden');
      return;
    }

    window.location.reload();
  }

  // ── Speech recognition ────────────────────────────────────────────────────

  initSpeechRecognition() {
    if (this.isIOS && !this.isNative) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.micBarBtn.classList.add('listening');
      this.voiceStatus.textContent = 'Listening…';
      this.voiceStatus.classList.remove('hidden', 'error');
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.input.value = transcript;
      this.sendBarBtn.classList.toggle('hidden', transcript.trim() === '');

      if (event.results[event.results.length - 1].isFinal) {
        this.voiceStatus.textContent = 'Got it!';
        setTimeout(() => {
          this.voiceStatus.classList.add('hidden');
          this.voiceStatus.textContent = '';
        }, 1200);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.micBarBtn.classList.remove('listening');
      if (event.error === 'not-allowed') {
        this.voiceStatus.textContent = 'Microphone access denied';
      } else if (event.error === 'no-speech') {
        this.voiceStatus.textContent = 'No speech detected';
      } else {
        this.voiceStatus.textContent = 'Error: ' + event.error;
      }
      this.voiceStatus.classList.add('error');
      this.voiceStatus.classList.remove('hidden');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.micBarBtn.classList.remove('listening');
      if (this.voiceStatus.textContent === 'Listening…') {
        this.voiceStatus.classList.add('hidden');
        this.voiceStatus.textContent = '';
      }
      this.sendBarBtn.classList.toggle('hidden', this.input.value.trim() === '');
    };
  }

  startVoice() {
    if (!this.recognition) { this.input.focus(); return; }
    if (this.isListening)  { this.recognition.stop(); return; }
    try { this.recognition.start(); } catch (e) { this.input.focus(); }
  }

  // ── Event wiring ──────────────────────────────────────────────────────────

  init() {
    this.micBarBtn.addEventListener('click', () => this.startVoice());

    this.input.addEventListener('input', () => {
      this.sendBarBtn.classList.toggle('hidden', this.input.value.trim() === '');
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && this.input.value.trim()) {
        e.preventDefault();
        this.saveEntry();
      }
    });

    this.sendBarBtn.addEventListener('click', () => this.saveEntry());

    this.favFilterBtn.addEventListener('click', () => {
      this.favFilterActive = !this.favFilterActive;
      this.favFilterBtn.classList.toggle('active', this.favFilterActive);
      this.favFilterBtn.setAttribute('aria-pressed', this.favFilterActive);
      this.render();
    });

    this.list.addEventListener('click', (e) => {
      // Date group header toggle
      const header = e.target.closest('.date-group-header');
      if (header) {
        const group = header.closest('.date-group');
        const isNowCollapsed = group.classList.toggle('collapsed');
        const arrow = header.querySelector('.collapse-arrow');
        if (arrow) arrow.textContent = isNowCollapsed ? '›' : '‹';
        return;
      }

      const card = e.target.closest('.good-thing-card');
      if (!card) return;
      const id = card.dataset.id;

      if (e.target.closest('.delete-btn'))                 this.deleteEntry(id);
      else if (e.target.closest('.info-btn'))              this.toggleInfoPanel(id);
      else if (e.target.closest('.fav-btn'))               this.toggleFavorite(id);
      else if (e.target.closest('.category-pill'))         this.setCategory(id, e.target.closest('.category-pill').dataset.category);
      else if (e.target.closest('.add-photo-btn'))         alert('Photo support coming soon!');
      else if (e.target.closest('.countdown-dismiss-btn')) this.dismissCategoryPanel(id);
    });

    this.logoutBtn.addEventListener('click', async () => {
      await AppAuth.signOut();
      window.location.reload();
    });
  }

  // ── Save / Delete ─────────────────────────────────────────────────────────

  saveEntry() {
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.sendBarBtn.classList.add('hidden');
    if (this.isListening) this.recognition.stop();

    if (this.activeCategoryPanelId) {
      this.dismissCategoryPanel(this.activeCategoryPanelId, true);
    }

    const entry = {
      id: crypto.randomUUID(),
      text,
      timestamp: new Date().toISOString(),
      category: DEFAULT_CATEGORY,
      favorite: false,
      photo: null
    };

    this.goodThings.unshift(entry);
    this.save();
    this.render();
    this.openCategoryPanel(entry.id);
    AppSync.syncAdd(entry);
  }

  deleteEntry(id) {
    if (this.activeCategoryPanelId === id) this.dismissCategoryPanel(id, true);
    if (this.activeInfoPanelId === id) this.activeInfoPanelId = null;
    this.goodThings = this.goodThings.filter(item => item.id !== id);
    this.save();
    this.render();
    AppSync.syncDelete(id);
  }

  // ── Category panel + countdown ────────────────────────────────────────────

  openCategoryPanel(id) {
    this.activeCategoryPanelId = id;
    this.countdownStart = Date.now();

    const card = document.querySelector(`.good-thing-card[data-id="${id}"]`);
    if (card) card.classList.add('new-tint');

    const panel = document.getElementById(`cat-panel-${id}`);
    if (!panel) return;
    panel.classList.add('open');
    this._animateCountdownBar(panel, COUNTDOWN_DURATION);

    let remaining = Math.ceil(COUNTDOWN_DURATION / 1000);
    const counter = panel.querySelector('.countdown-digits');
    if (counter) counter.textContent = remaining;

    this.countdownTimer = setInterval(() => {
      remaining -= 1;
      if (counter) counter.textContent = Math.max(0, remaining);
      if (remaining <= 0) this.dismissCategoryPanel(id);
    }, 1000);
  }

  _animateCountdownBar(panel, totalDuration) {
    const bar = panel.querySelector('.countdown-bar-fill');
    if (!bar) return;
    const elapsed = this.countdownStart ? Date.now() - this.countdownStart : 0;
    const remainingMs = Math.max(0, totalDuration - elapsed);
    const startPct = (remainingMs / totalDuration) * 100;
    bar.style.transition = 'none';
    bar.style.width = `${startPct}%`;
    bar.offsetWidth; // force reflow
    bar.style.transition = `width ${remainingMs}ms linear`;
    bar.style.width = '0%';
  }

  dismissCategoryPanel(id, silent = false) {
    clearInterval(this.countdownTimer);
    this.countdownTimer = null;
    if (this.activeCategoryPanelId === id) this.activeCategoryPanelId = null;
    if (!silent) {
      const panel = document.getElementById(`cat-panel-${id}`);
      if (panel) panel.classList.remove('open');
      const card = document.querySelector(`.good-thing-card[data-id="${id}"]`);
      if (card) card.classList.remove('new-tint');
    }
  }

  // ── Favorites ─────────────────────────────────────────────────────────────

  toggleFavorite(id) {
    const entry = this.goodThings.find(e => e.id === id);
    if (!entry) return;
    entry.favorite = !entry.favorite;
    this.save();

    const btn = document.querySelector(`.good-thing-card[data-id="${id}"] .fav-btn`);
    if (btn) {
      btn.classList.toggle('active', entry.favorite);
      btn.setAttribute('aria-label', entry.favorite ? 'Remove from favorites' : 'Add to favorites');
      const path = btn.querySelector('path');
      if (path) {
        path.setAttribute('fill', entry.favorite ? 'currentColor' : 'none');
        path.setAttribute('stroke-width', entry.favorite ? '0' : '1.8');
      }
    }

    if (this.favFilterActive) this.render();
    AppSync.syncUpdate(entry);
  }

  // ── Category selection ────────────────────────────────────────────────────

  setCategory(id, categoryId) {
    const entry = this.goodThings.find(e => e.id === id);
    if (!entry || !CATEGORIES[categoryId]) return;
    entry.category = categoryId;
    this.save();

    const cat = CATEGORIES[categoryId];

    const panel = document.getElementById(`cat-panel-${id}`);
    if (panel) {
      panel.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('selected', pill.dataset.category === categoryId);
      });
    }

    const circle = document.querySelector(`.good-thing-card[data-id="${id}"] .cat-icon-circle`);
    if (circle) {
      circle.style.background = cat.color;
      circle.style.color = cat.iconColor;
      circle.innerHTML = cat.svg;
    }

    const label = document.querySelector(`.good-thing-card[data-id="${id}"] .cat-label`);
    if (label) label.textContent = cat.label;

    AppSync.syncUpdate(entry);
  }

  // ── Info panel ────────────────────────────────────────────────────────────

  toggleInfoPanel(id) {
    if (this.activeInfoPanelId === id) {
      const panel = document.getElementById(`info-panel-${id}`);
      if (panel) panel.classList.remove('open');
      this.activeInfoPanelId = null;
      return;
    }
    if (this.activeInfoPanelId) {
      const prev = document.getElementById(`info-panel-${this.activeInfoPanelId}`);
      if (prev) prev.classList.remove('open');
    }
    this.activeInfoPanelId = id;
    const panel = document.getElementById(`info-panel-${id}`);
    if (panel) panel.classList.add('open');
  }

  // ── Data ──────────────────────────────────────────────────────────────────

  normaliseEntry(entry) {
    return { category: DEFAULT_CATEGORY, favorite: false, photo: null, ...entry };
  }

  save() {
    localStorage.setItem('goodThings', JSON.stringify(this.goodThings));
  }

  load() {
    const data = localStorage.getItem('goodThings');
    const arr = data ? JSON.parse(data) : [];
    return arr.map(e => this.normaliseEntry(e));
  }

  // ── Date grouping ─────────────────────────────────────────────────────────

  dateKey(isoString) {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  dateGroupLabel(key) {
    const today = this.dateKey(new Date().toISOString());
    if (key === today) return 'TODAY';
    const d = new Date(key + 'T12:00:00');
    const now = new Date();
    const diffDays = Math.round((now - d) / 86400000);
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays <= 6) {
      return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()].toUpperCase();
    }
    const opts = { month: 'short', day: 'numeric' };
    if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
    return d.toLocaleDateString('en-US', opts).toUpperCase();
  }

  groupByDate(entries) {
    const groups = new Map();
    for (const entry of entries) {
      const key = this.dateKey(entry.timestamp);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    }
    return Array.from(groups.entries()).map(([key, entries]) => ({
      key, label: this.dateGroupLabel(key), entries
    }));
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  render() {
    let entries = this.goodThings;
    if (this.favFilterActive) entries = entries.filter(e => e.favorite);

    if (entries.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.list.innerHTML = '';
      return;
    }

    this.emptyState.classList.add('hidden');

    const groups = this.groupByDate(entries);
    const todayKey = this.dateKey(new Date().toISOString());

    this.list.innerHTML = groups.map(group => {
      const isToday = group.key === todayKey;
      const count = group.entries.length;
      const countLabel = `· ${count} good thing${count === 1 ? '' : 's'}`;
      return `
        <div class="date-group ${isToday ? '' : 'collapsed'}" data-group-key="${group.key}">
          <div class="date-group-header">
            <span class="date-group-label">${group.label}</span>
            <span class="date-group-count">${countLabel}</span>
            <span class="collapse-arrow">${isToday ? '‹' : '›'}</span>
          </div>
          <div class="date-group-cards">
            ${group.entries.map(entry => this.renderCard(entry)).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Restore active countdown panel
    if (this.activeCategoryPanelId) {
      const card = document.querySelector(`.good-thing-card[data-id="${this.activeCategoryPanelId}"]`);
      if (card) card.classList.add('new-tint');
      const panel = document.getElementById(`cat-panel-${this.activeCategoryPanelId}`);
      if (panel) {
        panel.classList.add('open');
        this._animateCountdownBar(panel, COUNTDOWN_DURATION);
        const elapsed = Date.now() - this.countdownStart;
        const remaining = Math.max(0, Math.ceil((COUNTDOWN_DURATION - elapsed) / 1000));
        const counter = panel.querySelector('.countdown-digits');
        if (counter) counter.textContent = remaining;
      }
    }

    // Restore active info panel
    if (this.activeInfoPanelId) {
      const panel = document.getElementById(`info-panel-${this.activeInfoPanelId}`);
      if (panel) panel.classList.add('open');
    }
  }

  renderCard(entry) {
    const cat = CATEGORIES[entry.category] || CATEGORIES[DEFAULT_CATEGORY];
    const timeStr  = this.formatTime(new Date(entry.timestamp));
    const favFill  = entry.favorite ? 'currentColor' : 'none';
    const favStroke = entry.favorite ? '0' : '1.8';

    return `
      <div class="good-thing-card" data-id="${entry.id}">

        <div class="cat-icon-circle" style="background:${cat.color};color:${cat.iconColor}">
          ${cat.svg}
        </div>

        <div class="card-content">
          <div class="good-thing-text">${this.escapeHtml(entry.text)}</div>
          <div class="card-meta">
            <span class="good-thing-time">${timeStr}</span>
            <span class="meta-dot">·</span>
            <span class="cat-label">${cat.label}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="info-btn" aria-label="More info" data-id="${entry.id}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="8.01"/>
              <line x1="12" y1="11" x2="12" y2="16"/>
            </svg>
          </button>
          <button class="fav-btn ${entry.favorite ? 'active' : ''}"
                  aria-label="${entry.favorite ? 'Remove from favorites' : 'Add to favorites'}"
                  data-id="${entry.id}">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
                    fill="${favFill}" stroke="currentColor" stroke-width="${favStroke}"/>
            </svg>
          </button>
          <button class="delete-btn" aria-label="Delete" data-id="${entry.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="info-panel" id="info-panel-${entry.id}">
          <div class="info-panel-row">
            <div class="info-placeholder">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Location coming soon</span>
            </div>
            <div class="info-placeholder">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              <span>Photos coming soon</span>
            </div>
          </div>
        </div>

        <div class="cat-panel" id="cat-panel-${entry.id}">
          <div class="cat-panel-header">
            <span class="cat-panel-label">What kind of good thing?</span>
            <div class="countdown-wrap">
              <div class="countdown-bar"><div class="countdown-bar-fill"></div></div>
              <span class="countdown-digits">${Math.ceil(COUNTDOWN_DURATION / 1000)}</span>
            </div>
            <button class="countdown-dismiss-btn" data-id="${entry.id}" aria-label="Dismiss">×</button>
          </div>
          <div class="cat-pills">
            ${CATEGORY_ORDER.map(catId => {
              const c = CATEGORIES[catId];
              return `<button class="category-pill ${entry.category === catId ? 'selected' : ''}" data-category="${catId}">
                <span class="pill-icon" style="color:${c.iconColor}">${c.svg}</span>
                <span class="pill-label">${c.label}</span>
              </button>`;
            }).join('')}
          </div>
          <button class="add-photo-btn">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            Add a photo
          </button>
        </div>

      </div>
    `;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => { new GoodThings(); });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service worker registered'))
    .catch((err) => console.log('Service worker registration failed:', err));
}
