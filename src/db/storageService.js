/**
 * storageService.js
 * An abstraction layer for persistent storage, enabling future swaps to IndexedDB or cloud sync.
 * Currently uses localStorage but exposes an async API.
 */

const KEYS = {
    EVENTS: 'babbly_events',
    PROFILE: 'babbly_profile',
    SETTINGS: 'babbly_settings',
    MEMORIES: 'babbly_memories'
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

    // Memories
    async getMemories() {
        return JSON.parse(localStorage.getItem(KEYS.MEMORIES) || '[]');
    },
    async saveMemories(memoriesArray) {
        localStorage.setItem(KEYS.MEMORIES, JSON.stringify(memoriesArray));
    },
    async addMemory(memory) {
        const memories = await this.getMemories();
        memories.unshift(memory);
        await this.saveMemories(memories);
        return memory;
    },
    async updateMemory(id, updates) {
        const memories = await this.getMemories();
        const index = memories.findIndex(m => m.id === id);
        if (index !== -1) {
            memories[index] = { ...memories[index], ...updates, updatedAt: new Date().toISOString() };
            await this.saveMemories(memories);
            return memories[index];
        }
        throw new Error('Memory not found');
    },
    async deleteMemory(id) {
        const memories = await this.getMemories();
        const filtered = memories.filter(m => m.id !== id);
        await this.saveMemories(filtered);
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
