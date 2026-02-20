import React from 'react';
import { useEvents } from '../store/EventContext';

export function SummaryCard() {
    const { getTodayStats } = useEvents();
    const stats = getTodayStats();

    return (
        <div className="card mb-4" style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', textAlign: 'center' }}>Today's Summary</h2>
            <div className="stat-grid">
                <div className="stat-item">
                    <span className="stat-value">{stats.feeds}</span>
                    <span className="stat-label">Feeds</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.diapers}</span>
                    <span className="stat-label">Diapers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.sleepHours}h</span>
                    <span className="stat-label">Sleep</span>
                </div>
            </div>
        </div>
    );
}
