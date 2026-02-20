import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../db/storageService';
import { runMigrations } from '../db/migrations';

const EventContext = createContext();

export function EventProvider({ children }) {
    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState({ name: '', dob: '', onboadingComplete: false });
    const [isLoading, setIsLoading] = useState(true);

    // Initialize and migrate on mount
    useEffect(() => {
        async function initDb() {
            await runMigrations();
            const loadedProfile = await storageService.getProfile();
            if (loadedProfile) setProfile(loadedProfile);

            const loadedEvents = await storageService.getEvents();
            setEvents(loadedEvents);
            setIsLoading(false);
        }
        initDb();
    }, []);

    const updateProfile = async (updates) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        await storageService.setProfile(newProfile);
    };

    const addEvent = async (type, metadata, customStartTime = null, customEndTime = null) => {
        const now = new Date().toISOString();

        // Enforce structural metadata schema defaults
        const structuredMetadata = { ...metadata };
        if (type === 'feed') {
            structuredMetadata.subType = structuredMetadata.subType || 'breast';
        } else if (type === 'diaper') {
            structuredMetadata.condition = structuredMetadata.condition || 'wet';
            structuredMetadata.isBlowout = structuredMetadata.isBlowout || false;
            structuredMetadata.hasRash = structuredMetadata.hasRash || false;
            structuredMetadata.hasUnusualSmell = structuredMetadata.hasUnusualSmell || false;
        } else if (type === 'sleep') {
            structuredMetadata.location = structuredMetadata.location || 'crib';
            structuredMetadata.quality = structuredMetadata.quality || 3;
        } else if (type === 'pump') {
            structuredMetadata.side = structuredMetadata.side || 'both';
            structuredMetadata.pumpType = structuredMetadata.pumpType || 'electric';
        }

        const newEvent = {
            id: crypto.randomUUID(),
            type,
            startTime: customStartTime || now,
            endTime: customEndTime,
            metadata: structuredMetadata,
            createdBy: 'local_user',
            createdAt: now,
            updatedAt: now
        };
        await storageService.addEvent(newEvent);
        // Refresh local state by getting the newly saved copy to stay perfectly synced
        setEvents(await storageService.getEvents());
    };

    const deleteEvent = async (id) => {
        await storageService.deleteEvent(id);
        setEvents(await storageService.getEvents());
    };

    const updateEvent = async (id, updates) => {
        await storageService.updateEvent(id, updates);
        setEvents(await storageService.getEvents());
    };

    const getTodayStats = () => {
        const today = new Date().toDateString();
        const todayEvents = events.filter(e => new Date(e.startTime).toDateString() === today);

        let feeds = 0;
        let diapers = 0;
        let sleepDurationMs = 0;

        todayEvents.forEach(e => {
            if (e.type === 'feed') feeds++;
            if (e.type === 'diaper') diapers++;
            if (e.type === 'sleep') {
                const start = new Date(e.startTime).getTime();
                const end = e.endTime ? new Date(e.endTime).getTime() : new Date().getTime(); // ongoing
                sleepDurationMs += (end - start);
            }
        });

        return { feeds, diapers, sleepHours: (sleepDurationMs / (1000 * 60 * 60)).toFixed(1) };
    };

    return (
        <EventContext.Provider value={{
            events,
            profile,
            updateProfile,
            addEvent,
            deleteEvent,
            updateEvent,
            getTodayStats,
            isLoading
        }}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents() {
    return useContext(EventContext);
}
