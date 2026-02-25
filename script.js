class GoodThings {
  constructor() {
    this.goodThings = this.load();

    this.addBtn = document.getElementById('addBtn');
    this.entryForm = document.getElementById('entryForm');
    this.input = document.getElementById('goodThingInput');
    this.saveBtn = document.getElementById('saveBtn');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.voiceStatus = document.getElementById('voiceStatus');
    this.list = document.getElementById('goodThingsList');
    this.emptyState = document.getElementById('emptyState');
    this.loginScreen = document.getElementById('loginScreen');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginEmail = document.getElementById('loginEmail');
    this.loginError = document.getElementById('loginError');
    this.loginSent = document.getElementById('loginSent');
    this.loginFormEl = document.getElementById('loginForm');
    this.logoutBtn = document.getElementById('logoutBtn');

    this.recognition = null;
    this.isListening = false;
    this.longPressTimer = null;
    this.isLongPress = false;
    this.longPressDelay = 500;

    this.initApp();
  }

  async initApp() {
    const user = await AppAuth.init();

    if (!user) {
      this.showLoginScreen();
      return;
    }

    // First login for this user on this device → merge remote data
    const syncedUser = localStorage.getItem('gt_synced_user');
    if (syncedUser !== user.id) {
      await AppSync.pullRemote();
      localStorage.setItem('gt_synced_user', user.id);
      this.goodThings = this.load(); // reload after merge
    } else {
      AppSync.flushPending(); // background flush, don't block render
    }

    this.initSpeechRecognition();
    this.init();
    this.render();

    // Re-sync queued items when connectivity returns mid-session
    window.addEventListener('online', () => {
      if (AppAuth.currentUser) AppSync.flushPending();
    });
  }

  // ── Login screen ──────────────────────────────────────────

  showLoginScreen() {
    this.loginScreen.classList.remove('hidden');

    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.loginEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleLogin();
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
      this.loginBtn.textContent = 'Send magic link';
      this.loginError.textContent = error.message || 'Something went wrong. Please try again.';
      this.loginError.classList.remove('hidden');
      return;
    }

    this.loginFormEl.classList.add('hidden');
    this.loginSent.classList.remove('hidden');
  }

  // ── Speech recognition ────────────────────────────────────

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.voiceStatus.textContent = 'Listening...';
      this.voiceStatus.classList.remove('error');
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.input.value = transcript;

      if (event.results[event.results.length - 1].isFinal) {
        this.voiceStatus.textContent = 'Got it!';
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;

      if (event.error === 'not-allowed') {
        this.voiceStatus.textContent = 'Microphone access denied';
      } else if (event.error === 'no-speech') {
        this.voiceStatus.textContent = 'No speech detected';
      } else {
        this.voiceStatus.textContent = 'Error: ' + event.error;
      }
      this.voiceStatus.classList.add('error');
    };

    this.recognition.onend = () => {
      this.isListening = false;

      if (this.voiceStatus.textContent === 'Listening...') {
        this.voiceStatus.textContent = '';
      }
    };
  }

  // ── Event wiring ──────────────────────────────────────────

  init() {
    // Handle short tap vs long press on add button
    const startPress = (e) => {
      e.preventDefault();
      this.isLongPress = false;
      this.longPressTimer = setTimeout(() => {
        this.isLongPress = true;
        this.openForm(false); // text mode
      }, this.longPressDelay);
    };

    const endPress = (e) => {
      e.preventDefault();
      clearTimeout(this.longPressTimer);
      if (!this.isLongPress) {
        this.openForm(true); // voice mode
      }
    };

    const cancelPress = () => {
      clearTimeout(this.longPressTimer);
    };

    // Mouse events
    this.addBtn.addEventListener('mousedown', startPress);
    this.addBtn.addEventListener('mouseup', endPress);
    this.addBtn.addEventListener('mouseleave', cancelPress);

    // Touch events
    this.addBtn.addEventListener('touchstart', startPress, { passive: false });
    this.addBtn.addEventListener('touchend', endPress, { passive: false });
    this.addBtn.addEventListener('touchcancel', cancelPress);

    // Close form
    this.cancelBtn.addEventListener('click', () => this.closeForm());

    // Save entry
    this.saveBtn.addEventListener('click', () => this.saveEntry());

    // Save on Enter (but allow Shift+Enter for new line)
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.saveEntry();
      }
    });

    // Handle delete clicks via delegation
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        this.deleteEntry(id);
      }
    });

    // Sign out
    this.logoutBtn.addEventListener('click', async () => {
      await AppAuth.signOut();
      window.location.reload();
    });
  }

  // ── Form ──────────────────────────────────────────────────

  openForm(startVoice = false) {
    this.addBtn.classList.add('hidden');
    this.entryForm.classList.add('active');
    this.input.value = '';
    this.voiceStatus.textContent = '';

    if (startVoice && this.recognition) {
      this.voiceStatus.textContent = 'Listening...';
      setTimeout(() => {
        try {
          this.recognition.start();
        } catch (e) {
          this.input.focus();
        }
      }, 100);
    } else {
      if (!this.recognition) {
        this.voiceStatus.textContent = 'Voice not supported in this browser';
        this.voiceStatus.classList.add('error');
      }
      this.input.focus();
    }
  }

  closeForm() {
    this.entryForm.classList.remove('active');
    this.addBtn.classList.remove('hidden');
    this.input.value = '';
    this.voiceStatus.textContent = '';

    if (this.isListening) {
      this.recognition.stop();
    }
  }

  // ── Data ──────────────────────────────────────────────────

  saveEntry() {
    const text = this.input.value.trim();
    if (!text) return;

    const entry = {
      id: crypto.randomUUID(),
      text: text,
      timestamp: new Date().toISOString()
    };

    this.goodThings.unshift(entry);
    this.save();
    this.render();
    this.closeForm();

    AppSync.syncAdd(entry);
  }

  deleteEntry(id) {
    this.goodThings = this.goodThings.filter(item => item.id !== id);
    this.save();
    this.render();

    AppSync.syncDelete(id);
  }

  save() {
    localStorage.setItem('goodThings', JSON.stringify(this.goodThings));
  }

  load() {
    const data = localStorage.getItem('goodThings');
    return data ? JSON.parse(data) : [];
  }

  // ── Rendering ─────────────────────────────────────────────

  render() {
    if (this.goodThings.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.list.innerHTML = '';
      return;
    }

    this.emptyState.classList.add('hidden');

    this.list.innerHTML = this.goodThings.map(item => `
      <div class="good-thing-card" data-id="${item.id}">
        <button class="delete-btn" data-id="${item.id}" aria-label="Delete">×</button>
        <div class="good-thing-text">${this.escapeHtml(item.text)}</div>
        <div class="good-thing-time">${this.formatDate(item.timestamp)}</div>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Date formatting ───────────────────────────────────────

  formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;

    if (diffHours < 24 && date.getDate() === now.getDate()) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()) {
      return `Yesterday at ${this.formatTime(date)}`;
    }

    if (diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} at ${this.formatTime(date)}`;
    }

    const options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) options.year = 'numeric';
    return `${date.toLocaleDateString('en-US', options)} at ${this.formatTime(date)}`;
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new GoodThings();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service worker registered'))
    .catch((err) => console.log('Service worker registration failed:', err));
}
