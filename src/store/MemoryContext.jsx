import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../db/storageService';
import { memoryEngine } from '../services/memoryEngine';
import { useEvents } from './EventContext';

const MemoryContext = createContext();

export function MemoryProvider({ children }) {
    const { events } = useEvents();
    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from storage
    useEffect(() => {
        let mounted = true;

        async function loadMemories() {
            try {
                const data = await storageService.getMemories();
                if (mounted) {
                    setMemories(data);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to load memories:', err);
                if (mounted) setIsLoading(false);
            }
        }

        loadMemories();
        return () => { mounted = false; };
    }, []);

    // Engine: Scan events for new memories whenever events change
    useEffect(() => {
        if (isLoading || events.length === 0) return;

        const runEngine = async () => {
            const newMemories = memoryEngine.generateMemories(events, memories);
            if (newMemories.length > 0) {
                const updatedMemories = [...newMemories, ...memories];
                setMemories(updatedMemories);
                // Persist directly avoiding race conditions
                await storageService.saveMemories(updatedMemories);
            }
        };

        runEngine();
    }, [events, isLoading]); // Depending on memories here might cause loops, so we rely on the closure state in the engine. Actually, memoryEngine checks existingMemories. We should be careful to not trigger infinite loops.

    // Manual Operations
    const updateMemory = async (id, updates) => {
        const updated = await storageService.updateMemory(id, updates);
        setMemories(prev => prev.map(m => m.id === id ? updated : m));
    };

    const deleteMemory = async (id) => {
        await storageService.deleteMemory(id);
        setMemories(prev => prev.filter(m => m.id !== id));
    };

    const toggleFavorite = async (id) => {
        const memory = memories.find(m => m.id === id);
        if (memory) {
            await updateMemory(id, { isFavorite: !memory.isFavorite });
        }
    };

    return (
        <MemoryContext.Provider value={{
            memories,
            isLoading,
            updateMemory,
            deleteMemory,
            toggleFavorite
        }}>
            {children}
        </MemoryContext.Provider>
    );
}

export const useMemories = () => useContext(MemoryContext);
