// ── Category definitions ──────────────────────────────────────────────────

const CATEGORIES = {
  people: {
    id: 'people', label: 'People', color: '#e0f2f0', iconColor: '#2ec4b6',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="9" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/></svg>'
  },
  places: {
    id: 'places', label: 'Places', color: '#fef0e7', iconColor: '#ff8c42',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/></svg>'
  },
  nature: {
    id: 'nature', label: 'Nature', color: '#e8f5e9', iconColor: '#4caf50',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>'
  },
  music: {
    id: 'music', label: 'Music', color: '#e0f5f3', iconColor: '#26a69a',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z"/><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z"/><path d="m11.9 12.1 4.514-4.514"/><path d="m6 16 2 2"/></svg>'
  },
  views: {
    id: 'views', label: 'Views', color: '#e8f4fd', iconColor: '#2196f3',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>'
  },
  reading: {
    id: 'reading', label: 'Reading', color: '#eee8fd', iconColor: '#7c4dff',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>'
  },
  moment: {
    id: 'moment', label: 'Moment', color: '#fef3c7', iconColor: '#d97706',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>'
  }
};

const CATEGORY_ORDER = ['people', 'places', 'nature', 'music', 'views', 'reading', 'moment'];
const DEFAULT_CATEGORY = null;  // no default — user picks in the countdown panel
const COUNTDOWN_DURATION = 8000;

// Star icon shown when no category is selected
const STAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';

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
    this.swipedCardId          = null;

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
      // Close any swiped card when tapping elsewhere
      if (this.swipedCardId) {
        if (!e.target.closest('.swipe-delete-btn')) {
          this.closeSwipe(this.swipedCardId);
          return; // absorb the tap
        }
      }

      // Swipe delete button (outside the card element)
      if (e.target.closest('.swipe-delete-btn')) {
        this.deleteEntry(e.target.closest('.swipe-delete-btn').dataset.id);
        return;
      }

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

      if (e.target.closest('.info-btn'))              this.toggleInfoPanel(id);
      else if (e.target.closest('.fav-btn'))               this.toggleFavorite(id);
      else if (e.target.closest('.category-pill'))         this.setCategory(id, e.target.closest('.category-pill').dataset.category);
      else if (e.target.closest('.photo-thumb'))             this.openLightbox(e.target.closest('.photo-thumb').src);
      else if (e.target.closest('.add-photo-btn'))         this.capturePhoto(id);
      else if (e.target.closest('.countdown-dismiss-btn')) this.dismissCategoryPanel(id);
    });

    this.initSwipe();

    this.logoutBtn.addEventListener('click', async () => {
      await AppAuth.signOut();
      window.location.reload();
    });
  }

  // ── Swipe to delete ───────────────────────────────────────────────────────

  initSwipe() {
    let startX = 0, startY = 0, currentX = 0;
    let activeCard = null;
    let isSwiping = false;
    let isScrolling = false;
    const deleteWidth = 80;
    const threshold = 50;

    this.list.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.good-thing-card');
      if (!card) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      activeCard = card;
      isSwiping = false;
      isScrolling = false;
      card.style.transition = 'none';
    }, { passive: true });

    this.list.addEventListener('touchmove', (e) => {
      if (!activeCard) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - startX;
      const deltaY = touchY - startY;

      if (!isSwiping && !isScrolling) {
        if (Math.abs(deltaY) > Math.abs(deltaX) + 5) { isScrolling = true; return; }
        if (Math.abs(deltaX) > 10) isSwiping = true;
      }
      if (isScrolling || !isSwiping) return;

      e.preventDefault();
      currentX = touchX;
      const base = this.swipedCardId === activeCard.dataset.id ? -deleteWidth : 0;
      const tx = Math.max(-deleteWidth, Math.min(0, base + deltaX));
      activeCard.style.transform = `translateX(${tx}px)`;
    }, { passive: false });

    this.list.addEventListener('touchend', () => {
      if (!activeCard || !isSwiping) { activeCard = null; return; }
      activeCard.style.transition = 'transform 0.3s ease';
      const base = this.swipedCardId === activeCard.dataset.id ? -deleteWidth : 0;
      const finalX = base + (currentX - startX);
      if (finalX < -threshold) {
        activeCard.style.transform = `translateX(-${deleteWidth}px)`;
        this.swipedCardId = activeCard.dataset.id;
      } else {
        activeCard.style.transform = 'translateX(0)';
        if (this.swipedCardId === activeCard.dataset.id) this.swipedCardId = null;
      }
      activeCard = null;
      isSwiping = false;
    }, { passive: true });
  }

  closeSwipe(id) {
    const card = document.querySelector(`.good-thing-card[data-id="${id}"]`);
    if (card) {
      card.style.transition = 'transform 0.3s ease';
      card.style.transform = 'translateX(0)';
    }
    if (this.swipedCardId === id) this.swipedCardId = null;
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
      category: null,
      favorite: false,
      photo: null,
      location_name: null
    };

    this.goodThings.unshift(entry);
    this.save();
    this.render();
    this.openCategoryPanel(entry.id);
    AppSync.syncAdd(entry);
    this._captureLocation(entry); // fire and forget

    // Safety net: if location never resolves within 15 s, remove the pending row
    setTimeout(() => {
      if (!entry.location_name) {
        const panel = document.getElementById(`info-panel-${entry.id}`);
        const row = panel?.querySelector('.info-location.info-pending');
        if (row) row.remove();
      }
    }, 15000);
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
    if (label) {
      label.textContent = cat.label;
      label.classList.remove('hidden');
    }
    const dot = document.querySelector(`.good-thing-card[data-id="${id}"] .meta-dot`);
    if (dot) dot.classList.remove('hidden');

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

  // ── Location capture ──────────────────────────────────────────────────────

  async _captureLocation(entry) {
    try {
      let coords;
      console.log('[Location] Starting. isNative:', this.isNative,
        'CapGeo:', !!window.Capacitor?.Plugins?.Geolocation,
        'navGeo:', !!navigator.geolocation);

      if (this.isNative && window.Capacitor?.Plugins?.Geolocation) {
        try {
          console.log('[Location] Requesting Capacitor permissions…');
          const status = await window.Capacitor.Plugins.Geolocation.requestPermissions();
          console.log('[Location] Permission status:', JSON.stringify(status));
          if (status.location !== 'granted' && status.location !== 'limited') {
            throw new Error('Location permission ' + status.location);
          }
          console.log('[Location] Getting position via Capacitor…');
          const position = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: false
          });
          coords = position.coords;
          console.log('[Location] Capacitor coords:', coords.latitude, coords.longitude);
        } catch (capErr) {
          console.warn('[Location] Capacitor failed, trying browser fallback:', capErr?.message);
          // Fall back to browser geolocation API (works in WKWebView)
          if (navigator.geolocation) {
            coords = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                pos => resolve(pos.coords),
                err => reject(err),
                { timeout: 10000, enableHighAccuracy: false }
              );
            });
            console.log('[Location] Browser fallback coords:', coords.latitude, coords.longitude);
          } else {
            throw capErr; // re-throw original error
          }
        }
      } else if (navigator.geolocation) {
        console.log('[Location] Using browser geolocation…');
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => resolve(pos.coords),
            err => reject(err),
            { timeout: 10000, enableHighAccuracy: false }
          );
        });
        console.log('[Location] Browser coords:', coords.latitude, coords.longitude);
      } else {
        console.log('[Location] No geolocation available');
        return;
      }

      console.log('[Location] Reverse geocoding…');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!response.ok) {
        console.error('[Location] Geocode HTTP error:', response.status);
        return;
      }
      const data = await response.json();
      console.log('[Location] Geocode result:', data.display_name);

      const name = this._formatLocation(data.address, data.display_name);
      if (!name) {
        console.warn('[Location] Could not format location name');
        return;
      }

      entry.location_name = name;
      this.save();
      console.log('[Location] Saved:', name);

      // Update info panel DOM if open — swap "Getting location…" for the real name
      const infoPanel = document.getElementById(`info-panel-${entry.id}`);
      if (infoPanel) {
        const locRow = infoPanel.querySelector('.info-location');
        if (locRow) {
          locRow.classList.remove('info-pending');
          locRow.querySelector('span').textContent = name;
        } else {
          const row = infoPanel.querySelector('.info-panel-row');
          if (row) {
            const div = document.createElement('div');
            div.className = 'info-placeholder info-location';
            div.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><span>${this.escapeHtml(name)}</span>`;
            row.prepend(div);
          }
        }
      }

      AppSync.syncUpdate(entry);
    } catch (err) {
      console.error('[Location] Capture failed:', err?.message || err);
      const panel = document.getElementById(`info-panel-${entry.id}`);
      const row = panel?.querySelector('.info-location.info-pending');
      if (row) row.remove();
    }
  }

  _formatLocation(addr, displayName) {
    if (!addr) return displayName?.split(',').slice(0, 2).join(',').trim() || null;
    const place = addr.suburb || addr.neighbourhood || addr.city_district || addr.hamlet || addr.village || addr.road;
    const area  = addr.city || addr.town || addr.county;
    if (place && area && place !== area) return `${place}, ${area}`;
    if (place) return place;
    if (area)  return area;
    return displayName?.split(',').slice(0, 2).join(',').trim() || null;
  }

  // ── Photo capture ──────────────────────────────────────────────────────

  async capturePhoto(entryId) {
    try {
      let base64;
      console.log('[Photo] Starting. isNative:', this.isNative,
        'CapCamera:', !!window.Capacitor?.Plugins?.Camera);

      if (this.isNative && window.Capacitor?.Plugins?.Camera) {
        const Camera = window.Capacitor.Plugins.Camera;

        // Capacitor 8 requires explicit permission request before getPhoto
        console.log('[Photo] Requesting camera permissions…');
        const perms = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
        console.log('[Photo] Permission status:', JSON.stringify(perms));

        console.log('[Photo] Calling getPhoto…');
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: 'base64',
          source: 'prompt',
          width: 800,
          height: 800
        });
        console.log('[Photo] Got image, format:', image.format, 'length:', image.base64String?.length);
        base64 = `data:image/${image.format};base64,${image.base64String}`;
      } else {
        console.log('[Photo] Using web file picker fallback');
        base64 = await this._pickPhotoWeb();
      }

      if (!base64) { console.log('[Photo] No image (user cancelled)'); return; }

      // Resize via canvas to max 400px, JPEG 0.7
      console.log('[Photo] Resizing…');
      const resized = await this._resizePhoto(base64, 400, 0.7);
      console.log('[Photo] Resized, length:', resized.length);

      const entry = this.goodThings.find(e => e.id === entryId);
      if (!entry) return;
      entry.photo = resized;
      this.save();

      // Update DOM — swap add-photo placeholder with thumbnail in info panel
      this._updatePhotoInDOM(entryId, resized);

      AppSync.syncUpdate(entry);
      console.log('[Photo] Saved and synced');
    } catch (err) {
      if (err?.message?.includes('cancelled') || err?.message?.includes('canceled') || err?.message?.includes('User cancelled')) {
        console.log('[Photo] User cancelled');
        return;
      }
      console.error('[Photo] Capture failed:', err?.message || err, err);
    }
  }

  _pickPhotoWeb() {
    return new Promise((resolve) => {
      let input = document.getElementById('photoFileInput');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'photoFileInput';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
      }
      input.value = '';

      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }

  _resizePhoto(dataUrl, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  _updatePhotoInDOM(entryId, dataUrl) {
    const panel = document.getElementById(`info-panel-${entryId}`);
    if (!panel) return;
    const photoSlot = panel.querySelector('.photo-slot');
    if (photoSlot) {
      photoSlot.innerHTML = `<img class="photo-thumb" src="${dataUrl}" alt="Entry photo">`;
    }
  }

  // ── Photo lightbox ────────────────────────────────────────────────────

  openLightbox(src) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'photo-lightbox';
    overlay.innerHTML = `<img src="${src}" alt="Full photo">`;
    document.body.appendChild(overlay);

    const img = overlay.querySelector('img');

    // Fade in
    requestAnimationFrame(() => overlay.classList.add('visible'));

    // Close on tap (anywhere on the overlay)
    overlay.addEventListener('click', () => this._closeLightbox(overlay, img));

    // Swipe down to dismiss
    let startY = 0, currentY = 0, dragging = false;

    overlay.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      currentY = startY;
      dragging = true;
      img.style.transition = 'none';
    }, { passive: true });

    overlay.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY;
      const dy = currentY - startY;
      // Only allow downward drag
      if (dy > 0) {
        img.style.transform = `translateY(${dy}px)`;
        img.style.opacity = Math.max(0, 1 - dy / 300);
        overlay.style.background = `rgba(0,0,0,${Math.max(0, 0.92 - dy / 400)})`;
      }
    }, { passive: true });

    overlay.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      const dy = currentY - startY;
      if (dy > 80) {
        // Dismiss — fling down
        this._closeLightbox(overlay, img, dy);
      } else {
        // Snap back
        img.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        img.style.transform = 'translateY(0)';
        img.style.opacity = '1';
        overlay.style.transition = 'background 0.25s ease';
        overlay.style.background = 'rgba(0,0,0,0.92)';
      }
    }, { passive: true });
  }

  _closeLightbox(overlay, img, swipeDy = 0) {
    img.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    img.style.transform = `translateY(${swipeDy > 0 ? '120vh' : '0'})`;
    img.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s ease';
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 280);
  }

  // ── Data ──────────────────────────────────────────────────────────────────

  normaliseEntry(entry) {
    return { category: null, favorite: false, photo: null, location_name: null, ...entry };
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
    this.swipedCardId = null;
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
    // Icon circle — star for uncategorised, category icon otherwise
    const cat = entry.category ? CATEGORIES[entry.category] : null;
    const circleStyle = cat
      ? `background:${cat.color};color:${cat.iconColor}`
      : `background:#f0f9f8;color:#48bb78`;
    const circleIcon = cat ? cat.svg : STAR_SVG;

    const timeStr   = this.formatTime(new Date(entry.timestamp));
    const favFill   = entry.favorite ? 'currentColor' : 'none';
    const favStroke = entry.favorite ? '0' : '1.8';

    // Meta line — only show category label if one is set
    const metaExtra = cat
      ? `<span class="meta-dot">·</span><span class="cat-label">${cat.label}</span>`
      : '';

    // Location row in info panel
    const entryAge = Date.now() - new Date(entry.timestamp).getTime();
    const isNew = entryAge < 20000;
    let locationHtml = '';
    if (entry.location_name) {
      locationHtml = `
        <div class="info-placeholder info-location">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>${this.escapeHtml(entry.location_name)}</span>
        </div>`;
    } else if (isNew && this.isNative) {
      locationHtml = `
        <div class="info-placeholder info-location info-pending">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>Getting location…</span>
        </div>`;
    }

    return `
      <div class="swipe-container">
        <div class="swipe-actions">
          <button class="swipe-delete-btn" data-id="${entry.id}">Delete</button>
        </div>
        <div class="good-thing-card" data-id="${entry.id}">

          <div class="cat-icon-circle" style="${circleStyle}">
            ${circleIcon}
          </div>

          <div class="card-content">
            <div class="good-thing-text">${this.escapeHtml(entry.text)}</div>
            <div class="card-meta">
              <span class="good-thing-time">${timeStr}</span>
              ${metaExtra}
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
          </div>

          <div class="info-panel" id="info-panel-${entry.id}">
            <div class="info-panel-row">
              ${locationHtml}
              <div class="photo-slot">
                ${entry.photo
                  ? `<img class="photo-thumb" src="${entry.photo}" alt="Entry photo">`
                  : `<button class="add-photo-btn add-photo-btn-info">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                      Add photo
                    </button>`
                }
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
            ${!entry.photo ? `<button class="add-photo-btn">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              Add a photo
            </button>` : ''}
          </div>

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
