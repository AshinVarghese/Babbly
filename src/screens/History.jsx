import React, { useState, useMemo } from 'react';
import { useEvents } from '../store/EventContext';
import { intelligenceEngine } from '../services/intelligenceEngine';
import { FAB } from '../components/FAB';
import { QuickLogModal } from '../components/QuickLogModal';
import { IconFeed, IconDiaper, IconSleep, IconPump, IconNote, IconMedication, IconTemp } from '../components/Icons';

export function History({ onBack }) {
    const { events } = useEvents();
    const [filter, setFilter] = useState('all');
    const [visibleDays, setVisibleDays] = useState(7);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getIcon = (type) => {
        switch (type) {
            case 'feed': return <IconFeed />;
            case 'diaper': return <IconDiaper />;
            case 'sleep': return <IconSleep />;
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
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Derived filtered events
    const filteredEvents = useMemo(() => {
        if (filter === 'all') return events;
        return events.filter(e => e.type === filter);
    }, [events, filter]);

    // Group by Day
    const groupedDays = useMemo(() => {
        const sorted = [...filteredEvents].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const groups = sorted.reduce((acc, log) => {
            const dateStr = new Date(log.startTime).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(log);
            return acc;
        }, {});
        return Object.entries(groups);
    }, [filteredEvents]);

    // Calculate Summary Stats for a day
    const getDayStats = (dayLogs) => {
        let feeds = 0;
        let diapers = 0;
        let sleepMs = 0;
        dayLogs.forEach(log => {
            if (log.type === 'feed') feeds++;
            if (log.type === 'diaper') diapers++;
            if (log.type === 'sleep' && log.metadata.duration) sleepMs += log.metadata.duration;
        });
        const sleepHours = (sleepMs / (1000 * 60 * 60)).toFixed(1);
        return { feeds, diapers, sleepHours };
    };

    const visibleGroups = groupedDays.slice(0, visibleDays);

    return (
        <div className="app-container" style={{ position: 'relative' }}>
            {/* Header & Sticky Filter Row */}
            <div style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'var(--color-bg)', paddingTop: '1rem', paddingBottom: '1rem', margin: '-1rem -1rem 1rem -1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <button className="btn-icon" style={{ backgroundColor: 'transparent', border: 'none' }} onClick={onBack}>
                            <span style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>←</span>
                        </button>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>History</h1>
                    </div>
                    {filter !== 'all' && (
                        <button style={{ background: 'none', border: 'none', color: 'var(--color-text-light)', fontSize: '0.875rem' }} onClick={() => setFilter('all')}>
                            Reset
                        </button>
                    )}
                </div>

                {/* Filter Chips */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                    {['all', 'feed', 'sleep', 'diaper', 'pump'].map(type => (
                        <button
                            key={type}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '1.5rem',
                                border: '1px solid',
                                borderColor: filter === type ? 'var(--color-primary)' : 'var(--color-border)',
                                backgroundColor: filter === type ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: filter === type ? '#fff' : 'var(--color-text)',
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                flexShrink: 0,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={() => setFilter(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {visibleGroups.length === 0 ? (
                <div className="card text-center" style={{ marginTop: '2rem', padding: '3rem 1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
                    <p className="text-sm">No {filter !== 'all' ? filter : ''} logs found.</p>
                </div>
            ) : (
                <>
                    {/* Analytics Glance Panel */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Insights</h3>
                            <span className="text-xs" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>7 Days</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory' }}>
                            <div className="card" style={{ minWidth: '140px', padding: '1rem', scrollSnapAlign: 'start' }}>
                                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Avg Feed Gap</h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-feed)' }}>2.4h</div>
                                <div style={{ marginTop: '8px', height: '24px', position: 'relative' }}>
                                    <svg viewBox="0 0 100 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        <polyline fill="none" stroke="var(--color-feed)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,20 20,15 40,22 60,10 80,18 100,5" />
                                    </svg>
                                </div>
                            </div>
                            <div className="card" style={{ minWidth: '140px', padding: '1rem', scrollSnapAlign: 'start' }}>
                                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Longest Sleep</h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-sleep)' }}>5.5h</div>
                                <div style={{ marginTop: '8px', height: '24px', position: 'relative' }}>
                                    <svg viewBox="0 0 100 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        <polyline fill="none" stroke="var(--color-sleep)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,5 20,12 40,8 60,15 80,5 100,10" />
                                    </svg>
                                </div>
                            </div>
                            <div className="card" style={{ minWidth: '140px', padding: '1rem', scrollSnapAlign: 'start' }}>
                                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Diapers / Day</h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-diaper)' }}>6.2</div>
                                <div style={{ marginTop: '8px', height: '24px', position: 'relative' }}>
                                    <svg viewBox="0 0 100 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        <polyline fill="none" stroke="var(--color-diaper)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,15 20,10 40,12 60,8 80,18 100,6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Day Groups */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {visibleGroups.map(([date, dayLogs]) => {
                            const stats = getDayStats(dayLogs);
                            return (
                                <div key={date} style={{ animation: 'fadeIn 0.3s' }}>
                                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', position: 'sticky', top: '120px', backgroundColor: 'var(--color-bg)', padding: '0.5rem 0', zIndex: 10 }}>
                                        {date}
                                    </h2>

                                    {/* Intelligence Engine: Daily Story */}
                                    {(() => {
                                        const story = intelligenceEngine.generateDailyStory(filteredEvents, new Date(dayLogs[0].startTime));
                                        if (!story) return null;
                                        return (
                                            <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', padding: '1rem', borderLeft: '4px solid var(--color-primary)', marginTop: '0.5rem' }}>
                                                <h4 style={{ fontSize: '0.875rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>📖 {story.title}</h4>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{story.body}</p>
                                            </div>
                                        );
                                    })()}

                                    <div className="card" style={{ padding: '0', overflow: 'hidden', marginTop: '1rem' }}>

                                        {/* Summary Row */}
                                        {(filter === 'all' || filter === 'sleep' || filter === 'feed' || filter === 'diaper') && (
                                            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                                <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{stats.feeds}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Feeds</div>
                                                </div>
                                                <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{stats.sleepHours}h</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Sleep</div>
                                                </div>
                                                <div style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{stats.diapers}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Diapers</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mini Timeline View */}
                                        <div style={{ padding: '1rem' }}>
                                            {dayLogs.map((log) => (
                                                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative' }}>
                                                    <div style={{ width: '40px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                                                        {formatTime(log.startTime)}
                                                    </div>
                                                    <div className={`timeline-icon-wrap ${getColorClass(log.type)}`} style={{ width: '28px', height: '28px', margin: 0 }}>
                                                        {React.cloneElement(getIcon(log.type), { width: 14, height: 14 })}
                                                    </div>
                                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.875rem' }}>{log.type}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                                                            {log.type === 'feed' && log.metadata.subType}
                                                            {log.type === 'sleep' && log.metadata.duration && `${(log.metadata.duration / 3600000).toFixed(1)}h`}
                                                            {log.type === 'diaper' && log.metadata.condition}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {visibleDays < groupedDays.length && (
                        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
                            <button className="btn btn-outline" onClick={() => setVisibleDays(prev => prev + 7)}>
                                Load Older Days
                            </button>
                        </div>
                    )}
                </>
            )}

            <FAB onClick={() => setIsModalOpen(true)} onPredictClick={(type) => { setFilter(type); setIsModalOpen(true); }} />
            <QuickLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType={filter !== 'all' ? filter : undefined} />
        </div>
    );
}
