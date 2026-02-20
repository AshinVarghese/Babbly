/**
 * migrations.js
 * Handles schema upgrades. E.g., v1 -> v2 Unified Event Model
 */

import { storageService } from './storageService';

export async function runMigrations() {
    const legacyLogsRaw = storageService.getRawLegacyLogs();
    const legacyBabyRaw = storageService.getRawLegacyBaby();

    if (!legacyLogsRaw && !legacyBabyRaw) {
        return; // Already migrated or fresh install
    }

    console.log('[Babbly] Migrating legacy data to unified event model...');

    // 1. Migrate Profile
    let profile = { id: 'default-baby', name: '', dob: '', onboadingComplete: false };
    if (legacyBabyRaw) {
        const oldBaby = JSON.parse(legacyBabyRaw);
        profile = {
            ...profile,
            name: oldBaby.name || '',
            dob: oldBaby.dob || '',
            onboadingComplete: oldBaby.onboadingComplete || false
        };
    }
    await storageService.setProfile(profile);

    // 2. Migrate Events
    if (legacyLogsRaw) {
        const oldLogs = JSON.parse(legacyLogsRaw);
        const newEvents = oldLogs.map(log => {
            return {
                id: log.id || crypto.randomUUID(),
                type: log.type,
                startTime: log.timestamp, // In v1, logs were point-in-time
                endTime: log.type === 'sleep' ? new Date(new Date(log.timestamp).getTime() + (log.details.duration || 0)).toISOString() : null,
                metadata: log.details || {},
                createdBy: 'local_user',
                createdAt: log.timestamp,
                updatedAt: log.timestamp,
            };
        });
        await storageService.saveEvents(newEvents);
    }

    // 3. Cleanup
    storageService.clearLegacyData();
    console.log('[Babbly] Migration complete.');
}
