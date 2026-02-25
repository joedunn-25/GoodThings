// auth.js — Supabase authentication for Good Things

(function () {
  // Guard: if config hasn't been filled in yet
  const configMissing = !window.SUPABASE_URL ||
    typeof SUPABASE_URL === 'undefined' ||
    SUPABASE_URL.includes('your-project-id');

  // Guard: if Supabase CDN didn't load (e.g. offline on very first visit)
  const sdkMissing = !window.supabase;

  if (configMissing || sdkMissing) {
    if (configMissing) {
      console.warn('Good Things: Fill in config.js with your Supabase credentials.');
    }
    window.AppAuth = {
      supabase: null,
      currentUser: null,
      async init() { return null; },
      async signIn() { return { message: 'App not configured. Please fill in config.js.' }; },
      async verifyOtp() { return { error: { message: 'App not configured. Please fill in config.js.' } }; },
      async signOut() {}
    };
    return;
  }

  const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.AppAuth = {
    supabase: _supabase,
    currentUser: null,

    async init() {
      const { data: { session } } = await _supabase.auth.getSession();
      this.currentUser = session?.user ?? null;

      // Clean any stale hash fragment (defensive, no longer expected)
      if (window.location.hash.includes('access_token')) {
        history.replaceState(null, '', window.location.pathname);
      }

      return this.currentUser;
    },

    async signIn(email) {
      // Omitting emailRedirectTo sends a 6-digit OTP code instead of a magic link
      const { error } = await _supabase.auth.signInWithOtp({ email });
      return error; // null on success
    },

    async verifyOtp(email, token) {
      const { data, error } = await _supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      if (!error) {
        this.currentUser = data.user;
      }
      return { data, error };
    },

    async signOut() {
      await _supabase.auth.signOut();
      this.currentUser = null;
    }
  };
})();
