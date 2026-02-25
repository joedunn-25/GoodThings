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
      async signOut() {}
    };
    return;
  }

  const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.AppAuth = {
    supabase: _supabase,
    currentUser: null,

    async init() {
      // Supabase JS v2 automatically detects the #access_token hash from a
      // magic link redirect and calls setSession() before getSession() resolves.
      const { data: { session } } = await _supabase.auth.getSession();
      this.currentUser = session?.user ?? null;

      // Clean the hash fragment so it's not accidentally shared
      if (window.location.hash.includes('access_token')) {
        history.replaceState(null, '', window.location.pathname);
      }

      return this.currentUser;
    },

    async signIn(email) {
      const { error } = await _supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });
      return error; // null on success
    },

    async signOut() {
      await _supabase.auth.signOut();
      this.currentUser = null;
    }
  };
})();
