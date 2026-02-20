/**
 * reminderService.js
 * Local notification orchestrator handling permissions and scheduling logic.
 */

export const reminderService = {
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notifications');
            return false;
        }
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    async scheduleReminder(title, options, delayMs) {
        if (Notification.permission !== 'granted') {
            const granted = await this.requestPermission();
            if (!granted) return null; // Graceful degradation
        }

        return setTimeout(() => {
            this.showNotification(title, options);
        }, delayMs);
    },

    showNotification(title, options) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/vite.svg', // Placeholder PWA icon
                badge: '/vite.svg',
                ...options
            });
        }
    }
};
