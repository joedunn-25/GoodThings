// sync.js — Supabase sync for Good Things
// Manages offline queue and first-login merge.

window.AppSync = {

  get _db() { return window.AppAuth?.supabase; },
  get _userId() { return window.AppAuth?.currentUser?.id; },

  _getPendingAdds() {
    return JSON.parse(localStorage.getItem('pendingAdds') || '[]');
  },
  _setPendingAdds(val) {
    localStorage.setItem('pendingAdds', JSON.stringify(val));
  },
  _getPendingDeletes() {
    return JSON.parse(localStorage.getItem('pendingDeletes') || '[]');
  },
  _setPendingDeletes(val) {
    localStorage.setItem('pendingDeletes', JSON.stringify(val));
  },

  // Called after saving a new entry locally.
  // Inserts to Supabase immediately if possible; otherwise queues it.
  async syncAdd(entry) {
    if (!this._db || !this._userId || !navigator.onLine) {
      this._queueAdd(entry);
      return;
    }
    const { error } = await this._db.from('entries').upsert(
      {
        id: entry.id,
        user_id: this._userId,
        text: entry.text,
        timestamp: entry.timestamp,
        category: entry.category || null,
        favorite: entry.favorite || false,
        location_name: entry.location_name || null,
        photo: entry.photo || null
      },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    if (error) this._queueAdd(entry);
  },

  // Called after updating an entry's category, favorite, or location.
  // Upserts to Supabase immediately if possible; no offline queue (non-critical).
  async syncUpdate(entry) {
    if (!this._db || !this._userId || !navigator.onLine) return;
    await this._db.from('entries').upsert(
      {
        id: entry.id,
        user_id: this._userId,
        text: entry.text,
        timestamp: entry.timestamp,
        category: entry.category || null,
        favorite: entry.favorite || false,
        location_name: entry.location_name || null,
        photo: entry.photo || null
      },
      { onConflict: 'id', ignoreDuplicates: false }
    );
  },

  // Called after deleting an entry locally.
  // Deletes from Supabase immediately if possible; otherwise queues it.
  async syncDelete(id) {
    // If this entry was pending upload, cancel that — it never needs to reach the server.
    const adds = this._getPendingAdds().filter(e => e.id !== id);
    this._setPendingAdds(adds);

    if (!this._db || !this._userId || !navigator.onLine) {
      this._queueDelete(id);
      return;
    }
    const { error } = await this._db.from('entries').delete()
      .eq('id', id)
      .eq('user_id', this._userId);
    if (error) this._queueDelete(id);
  },

  // Called on app start (when already synced before) and when coming back online.
  // Pushes any queued adds/deletes to Supabase.
  async flushPending() {
    if (!this._db || !this._userId || !navigator.onLine) return;

    const pendingAdds = this._getPendingAdds();
    if (pendingAdds.length) {
      const rows = pendingAdds.map(e => ({
        id: e.id,
        user_id: this._userId,
        text: e.text,
        timestamp: e.timestamp,
        category: e.category || null,
        favorite: e.favorite || false,
        location_name: e.location_name || null,
        photo: e.photo || null
      }));
      const { error } = await this._db.from('entries')
        .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
      if (!error) this._setPendingAdds([]);
    }

    const pendingDeletes = this._getPendingDeletes();
    if (pendingDeletes.length) {
      const { error } = await this._db.from('entries')
        .delete()
        .in('id', pendingDeletes)
        .eq('user_id', this._userId);
      if (!error) this._setPendingDeletes([]);
    }
  },

  // Called on first login for this user on this device.
  // Merges existing local entries with remote, uploads anything not yet in Supabase.
  async pullRemote() {
    if (!this._db || !this._userId) return;

    const { data: remote, error } = await this._db.from('entries')
      .select('id, text, timestamp, category, favorite, location_name, photo')
      .eq('user_id', this._userId)
      .order('timestamp', { ascending: false });

    if (error) return;

    const local = JSON.parse(localStorage.getItem('goodThings') || '[]');
    const isUUID = id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Re-ID any legacy entries that used Date.now() ids (not valid UUIDs)
    const remapped = local.map(e => ({ ...e, id: isUUID(e.id) ? e.id : crypto.randomUUID() }));

    const remoteIds = new Set((remote || []).map(e => e.id));
    const localIds  = new Set(remapped.map(e => e.id));

    // Upload local entries not yet in Supabase
    const toUpload = remapped
      .filter(e => !remoteIds.has(e.id))
      .map(e => ({
        id: e.id,
        user_id: this._userId,
        text: e.text,
        timestamp: e.timestamp,
        category: e.category || null,
        favorite: e.favorite || false,
        location_name: e.location_name || null,
        photo: e.photo || null
      }));

    if (toUpload.length) {
      await this._db.from('entries')
        .upsert(toUpload, { onConflict: 'id', ignoreDuplicates: true });
    }

    // Add remote-only entries (from another device)
    const remoteOnly = (remote || [])
      .filter(e => !localIds.has(e.id))
      .map(e => ({
        id: e.id,
        text: e.text,
        timestamp: e.timestamp,
        category: e.category || null,
        favorite: e.favorite || false,
        location_name: e.location_name || null,
        photo: e.photo || null
      }));

    // Merge and sort newest-first
    const merged = [...remapped, ...remoteOnly];
    merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    localStorage.setItem('goodThings', JSON.stringify(merged));
  },

  _queueAdd(entry) {
    const pending = this._getPendingAdds();
    if (!pending.find(e => e.id === entry.id)) {
      pending.push(entry);
      this._setPendingAdds(pending);
    }
  },

  _queueDelete(id) {
    const pending = this._getPendingDeletes();
    if (!pending.includes(id)) {
      pending.push(id);
      this._setPendingDeletes(pending);
    }
  }
};
