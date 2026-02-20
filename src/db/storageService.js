/**
 * storageService.js
 * An abstraction layer for persistent storage, enabling future swaps to IndexedDB or cloud sync.
 * Currently uses localStorage but exposes an async API.
 */

const KEYS = {
    EVENTS: 'babbly_events',
    PROFILE: 'babbly_profile',
    SETTINGS: 'babbly_settings'
};

export const storageService = {
    // Profiles & Settings
    async getProfile() {
        return JSON.parse(localStorage.getItem(KEYS.PROFILE) || 'null');
    },
    async setProfile(profile) {
        localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    },

    // Events
    async getEvents() {
        return JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    },
    async saveEvents(eventsArray) {
        localStorage.setItem(KEYS.EVENTS, JSON.stringify(eventsArray));
    },
    async addEvent(event) {
        const events = await this.getEvents();
        events.unshift(event); // newest first
        await this.saveEvents(events);
        return event;
    },
    async updateEvent(id, updates) {
        const events = await this.getEvents();
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
            await this.saveEvents(events);
            return events[index];
        }
        throw new Error('Event not found');
    },
    async deleteEvent(id) {
        const events = await this.getEvents();
        const filtered = events.filter(e => e.id !== id);
        await this.saveEvents(filtered);
    },

    // Raw Access (for migrations)
    getRawLegacyLogs() {
        return localStorage.getItem('babbly_logs');
    },
    getRawLegacyBaby() {
        return localStorage.getItem('babbly_baby');
    },
    clearLegacyData() {
        localStorage.removeItem('babbly_logs');
        localStorage.removeItem('babbly_baby');
    }
};
