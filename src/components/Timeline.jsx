import React, { useState } from 'react';
import { useEvents } from '../store/EventContext';
import { intelligenceEngine } from '../services/intelligenceEngine';
import { IconFeed, IconDiaper, IconSleep, IconPump, IconNote, IconMedication, IconTemp, IconSun, IconBreast } from './Icons';
import { EmptyState } from './EmptyState';

export function Timeline({ onEditLog }) {
    const { events, addEvent } = useEvents();
    const [swipedLogId, setSwipedLogId] = useState(null);

    const handleDuplicate = (log) => {
        addEvent(log.type, log.metadata);
        setSwipedLogId(null);
    };

    const getIcon = (type, metadata) => {
        switch (type) {
            case 'feed': return metadata?.subType === 'bottle' ? <IconFeed /> : (metadata?.subType === 'breast' ? <IconBreast /> : <IconFeed />);
            case 'diaper': return metadata?.condition === 'dirty' ? <span style={{ fontSize: '24px', lineHeight: 1 }}>💩</span> : <IconDiaper />;
            case 'sleep': return metadata?.duration && metadata.duration < 3600000 ? <IconSun /> : <IconSleep />;
            case 'pump': return <IconPump />;
            case 'medication': return <IconMedication />;
            case 'temp': return <IconTemp />;
            case 'note': return <IconNote />;
            default: return <IconNote />;
        }
    };

    const getColorClass = (type) => {
        switch (type) {
            case 'feed': return 'bg-feed';
            case 'diaper': return 'bg-diaper';
            case 'sleep': return 'bg-sleep';
            case 'pump': return 'bg-pump';
            default: return 'bg-feed';
        }
    };

    const formatTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getRelativeTime = (isoString) => {
        const diffTotalMs = new Date() - new Date(isoString);
        const diffMins = Math.round(diffTotalMs / 60000);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ago`;
    };

    const getDetailsText = (log) => {
        const { type, metadata } = log;
        const extra = [];
        if (metadata.mediaRef) extra.push('📸');
        if (metadata.notes) extra.push('📝');

        if (type === 'feed') {
            if (metadata.burped) extra.push('💨');
            const sideStr = metadata.side ? metadata.side.charAt(0).toUpperCase() + metadata.side.slice(1) : '';
            return `${metadata.subType === 'breast' ? 'Breast' : 'Bottle'} ${sideStr || metadata.amount || ''} ${extra.length ? ` · ${extra.join(' ')}` : ''}`;
        }
        if (type === 'diaper') {
            if (metadata.isBlowout) extra.push('⚠️ Blowout');
            if (metadata.hasRash) extra.push('Rash');
            let conditionStr = metadata.condition ? metadata.condition.charAt(0).toUpperCase() + metadata.condition.slice(1) : 'Diaper';
            return `${conditionStr} ${metadata.amountLevel ? `(${metadata.amountLevel})` : ''} ${extra.length ? ` · ${extra.join(' ')}` : ''}`;
        }
        if (type === 'sleep') {
            const hours = metadata.duration ? (metadata.duration / (1000 * 60 * 60)).toFixed(1) + 'h' : 'Started...';
            if (metadata.location) extra.push(metadata.location.replace('_', ' '));
            if (metadata.quality) extra.push('⭐'.repeat(metadata.quality));
            return `Duration: ${hours} ${extra.length ? ` · ${extra.join(' ')}` : ''}`;
        }
        if (type === 'pump') {
            if (metadata.storage) extra.push(`to ${metadata.storage}`);
            if (metadata.pumpType) extra.push(metadata.pumpType);
            if (metadata.discomfortLevel === 3) extra.push('😣');
            const sideStr = metadata.side ? metadata.side.charAt(0).toUpperCase() + metadata.side.slice(1) : '';
            return `${metadata.amount || ''} ${sideStr ? '(' + sideStr + ')' : ''} ${extra.length ? ` · ${extra.join(' ')}` : ''}`;
        }
        if (type === 'medication') return `${metadata.name || 'Unnamed Med'} - ${metadata.dose || '?'} ${extra.join(' ')}`;
        if (type === 'temp') return `${metadata.value || '?'} ${metadata.unit || 'F'} ${extra.join(' ')}`;
        if (type === 'note') return metadata.text || metadata.notes;
        return '';
    };

    const sortedLogs = [...events].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    if (sortedLogs.length === 0) {
        return (
            <EmptyState
                emoji="☁️"
                message="A quiet day so far."
                subMessage="Tap + to log an event"
            />
        );
    }

    const renderWithChips = () => {
        const items = [];

        for (let i = 0; i < sortedLogs.length; i++) {
            const log = sortedLogs[i];
            const isOngoing = log.type === 'sleep' && !log.endTime && !log.metadata.duration;

            items.push(
                <div key={log.id} className="timeline-item" style={{ animation: 'slideUp 300ms var(--ease-spring)' }}>
                    <div className={`timeline-icon-wrap ${getColorClass(log.type)} ${isOngoing ? 'pulse-idle' : ''}`}>
                        {getIcon(log.type, log.metadata)}
                    </div>
                    <div className="timeline-content" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
                        <div
                            style={{
                                transition: 'transform 0.3s var(--ease-spring)',
                                transform: swipedLogId === log.id ? 'translateX(-80px)' : 'translateX(0)',
                                padding: '1rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSwipedLogId(swipedLogId === log.id ? null : log.id)}
                        >
                            <div className="timeline-header">
                                <span className="timeline-title" style={{ textTransform: 'capitalize' }}>
                                    {log.type}
                                    {isOngoing && <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--color-primary)' }}>(Ongoing)</span>}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span className="timeline-time" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{formatTime(log.startTime)}</span>
                                    <span className="timeline-time">{getRelativeTime(log.startTime)}</span>
                                </div>
                            </div>
                            <div className="text-sm mt-2">{getDetailsText(log)}</div>
                        </div>

                        {/* Quick Actions Revealed on Swipe/Tap */}
                        <div style={{
                            position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            opacity: swipedLogId === log.id ? 1 : 0,
                            pointerEvents: swipedLogId === log.id ? 'auto' : 'none',
                            transition: 'opacity 0.3s',
                            backgroundColor: 'var(--color-bg)',
                            borderLeft: '1px solid var(--color-border)',
                            padding: '0 8px'
                        }}>
                            <button
                                className="btn-icon"
                                style={{ backgroundColor: 'var(--color-surface)', width: '40px', height: '40px', boxShadow: 'var(--shadow-sm)' }}
                                onClick={(e) => { e.stopPropagation(); onEditLog && onEditLog(log); }}
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon"
                                style={{ backgroundColor: 'var(--color-surface)', width: '40px', height: '40px', boxShadow: 'var(--shadow-sm)' }}
                                onClick={(e) => { e.stopPropagation(); handleDuplicate(log); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            );

            // Context chip logic & Intelligence Highlights
            const highlights = intelligenceEngine.analyzeClusters(sortedLogs);
            const smartChip = highlights.find(h => h.insertAfterId === log.id);

            if (smartChip) {
                items.push(
                    <div key={`smart-${smartChip.type}-${log.id}`} className="card mt-2 mb-4" style={{ backgroundColor: 'var(--color-primary-light)', padding: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
                        <h4 className="text-sm" style={{ color: 'var(--color-primary-dark)', marginBottom: '4px' }}>✨ {smartChip.title}</h4>
                        <p className="text-sm" style={{ color: 'var(--color-text)' }}>{smartChip.message}</p>
                    </div>
                );
            } else if (i < sortedLogs.length - 1) { // Standard manual time-gap logic
                const prevTimeLog = sortedLogs[i + 1];
                if (log.type === 'feed' && prevTimeLog.type === 'feed') {
                    const diffMs = new Date(log.startTime) - new Date(prevTimeLog.startTime);
                    const hours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
                    if (hours >= 1) {
                        items.push(
                            <div key={`chip-feed-${log.id}`} className="timeline-chip">
                                {hours}h since last feed
                            </div>
                        );
                    }
                } else if (log.type === 'sleep' && prevTimeLog.type === 'sleep') {
                    const diffMs = new Date(log.startTime) - new Date(prevTimeLog.startTime);
                    const hours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
                    if (hours >= 1) {
                        items.push(
                            <div key={`chip-sleep-${log.id}`} className="timeline-chip">
                                {hours}h awake time
                            </div>
                        );
                    }
                }
            }
        }
        return items;
    }

    return (
        <div className="timeline">
            {renderWithChips()}
        </div>
    );
}
