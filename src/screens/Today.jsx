import React, { useState } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { Timeline } from '../components/Timeline';
import { FAB } from '../components/FAB';
import { QuickLogModal } from '../components/QuickLogModal';
import { InstallPrompt } from '../components/InstallPrompt';
import { EventDetailSheet } from '../components/EventDetailSheet';
import { useEvents } from '../store/EventContext';

export function Today({ onNavigate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictedType, setPredictedType] = useState(null);
    const [editingLogId, setEditingLogId] = useState(null);
    const { profile } = useEvents();

    return (
        <div className="app-container">
            <div className="flex justify-between items-center mt-2 mb-2">
                <div>
                    <h1 style={{ marginBottom: 0 }}>{profile.name || 'Baby'}</h1>
                    <p className="text-sm">Today's Activity</p>
                </div>
                <div className="flex gap-2">
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
            <Timeline onEditLog={(log) => setEditingLogId(log.id)} />

            <FAB onClick={() => setIsModalOpen(true)} onPredictClick={(type) => { setPredictedType(type); setIsModalOpen(true); }} />
            <QuickLogModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPredictedType(null); }} defaultType={predictedType} />
            <EventDetailSheet isOpen={!!editingLogId} onClose={() => setEditingLogId(null)} logId={editingLogId} />
        </div>
    );
}
