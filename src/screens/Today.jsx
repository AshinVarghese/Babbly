import React, { useState } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { Timeline } from '../components/Timeline';
import { FAB } from '../components/FAB';
import { QuickLogModal } from '../components/QuickLogModal';
import { InstallPrompt } from '../components/InstallPrompt';
import { EventDetailSheet } from '../components/EventDetailSheet';
import { useEvents } from '../store/EventContext';
import { useMemories } from '../store/MemoryContext';

export function Today({ onNavigate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictedType, setPredictedType] = useState(null);
    const [editingLogId, setEditingLogId] = useState(null);
    const { profile } = useEvents();
    const { memories } = useMemories();

    const featuredMemory = React.useMemo(() => {
        if (!memories || memories.length === 0) return null;

        const today = new Date();
        const onThisDay = memories.find(m => {
            const mDate = new Date(m.timestamp);
            return mDate.getMonth() === today.getMonth() && mDate.getDate() === today.getDate() && mDate.getFullYear() < today.getFullYear();
        });
        if (onThisDay) return { ...onThisDay, contextLabel: 'On this day' };

        const fav = memories.find(m => m.isFavorite);
        if (fav) return { ...fav, contextLabel: 'Featured Memory' };

        const recent = memories.find(m => new Date(m.timestamp).toDateString() !== today.toDateString());
        if (recent) return { ...recent, contextLabel: 'Recent Milestone' };

        return null;
    }, [memories]);

    return (
        <div className="app-container">
            <div className="flex justify-between items-center mt-2 mb-2">
                <div>
                    <h1 style={{ marginBottom: 0 }}>{profile.name || 'Baby'}</h1>
                    <p className="text-sm">Today's Activity</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-icon" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', width: 40, height: 40 }} onClick={() => onNavigate('memories')}>
                        <span style={{ fontSize: '1.25rem' }}>✨</span>
                    </button>
                    <button className="btn-icon" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', width: 40, height: 40 }} onClick={() => onNavigate('history')}>
                        <span style={{ fontSize: '1.25rem' }}>🕒</span>
                    </button>
                    <button className="btn-icon" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', width: 40, height: 40 }} onClick={() => onNavigate('settings')}>
                        <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                    </button>
                </div>
            </div>

            <InstallPrompt />

            <SummaryCard />

            {featuredMemory && (
                <div
                    className="card mt-4 mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${featuredMemory.moodColor}22 0%, ${featuredMemory.moodColor}05 100%)`,
                        border: `1px solid ${featuredMemory.moodColor}44`,
                        display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer',
                        animation: 'slideUp 0.5s ease-out'
                    }}
                    onClick={() => onNavigate('memories')}
                >
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.65rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>✨ {featuredMemory.contextLabel}</h4>
                        <h3 style={{ fontSize: '1.25rem', fontFamily: 'serif', margin: 0, color: 'var(--color-text)' }}>{featuredMemory.title}</h3>
                    </div>
                    {featuredMemory.mediaRef && (
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={featuredMemory.mediaRef} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
            )}

            <Timeline onEditLog={(log) => setEditingLogId(log.id)} />

            <FAB onClick={() => setIsModalOpen(true)} onPredictClick={(type) => { setPredictedType(type); setIsModalOpen(true); }} />
            <QuickLogModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPredictedType(null); }} defaultType={predictedType} />
            <EventDetailSheet isOpen={!!editingLogId} onClose={() => setEditingLogId(null)} logId={editingLogId} />
        </div>
    );
}
