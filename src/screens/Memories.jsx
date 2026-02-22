import React, { useMemo, useState } from 'react';
import { useMemories } from '../store/MemoryContext';
import { MemoryEditorSheet } from '../components/MemoryEditorSheet';
import { shareService } from '../services/shareService';
import { useEvents } from '../store/EventContext';
import { EmptyState } from '../components/EmptyState';

export function Memories({ onBack }) {
    const { memories } = useMemories();
    const { profile } = useEvents();
    const [editingMemoryId, setEditingMemoryId] = useState(null);

    const groupedMemories = useMemo(() => {
        const groups = {};
        memories.forEach(m => {
            const date = new Date(m.timestamp);
            const monthYear = date.toLocaleDateString([], { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(m);
        });
        return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [memories]);

    return (
        <div className="app-container" style={{ position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'var(--color-bg)', paddingTop: '1rem', paddingBottom: '1rem', margin: '-1rem -1rem 1rem -1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div className="flex items-center gap-2">
                    <button className="btn-icon" style={{ backgroundColor: 'transparent', border: 'none' }} onClick={onBack}>
                        <span style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>←</span>
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Journal</h1>
                </div>
            </div>

            {memories.length === 0 ? (
                <EmptyState
                    emoji="✨"
                    message="Your Story Begins Here"
                    subMessage="As you log daily moments, beautifully crafted memories will automatically appear here to celebrate your journey."
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {groupedMemories.map(([month, monthMemories]) => (
                        <div key={month} style={{ animation: 'fadeIn 0.5s' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', fontFamily: 'serif', fontStyle: 'italic', marginBottom: '1rem', textAlign: 'center' }}>
                                ~ {month} ~
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {monthMemories.map(memory => (
                                    <div
                                        key={memory.id}
                                        className="card"
                                        style={{
                                            background: `linear-gradient(135deg, ${memory.moodColor}22 0%, ${memory.moodColor}05 100%)`,
                                            border: `1px solid ${memory.moodColor}44`,
                                            padding: '1.5rem',
                                            borderRadius: '24px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                        }}
                                        onClick={() => setEditingMemoryId(memory.id)}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: memory.moodColor, opacity: 0.1, filter: 'blur(20px)' }}></div>

                                        <div className="flex justify-between items-start mb-2">
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {new Date(memory.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                            <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
                                                {memory.isFavorite && <span style={{ color: 'var(--color-warning)' }}>⭐</span>}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); shareService.exportMemoryAsImage(memory, profile.name); }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                    aria-label="Share Memory"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                                </button>
                                            </div>
                                        </div>

                                        {memory.mediaRef && (
                                            <div style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem', backgroundColor: 'var(--color-surface)' }}>
                                                <img src={memory.mediaRef} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}

                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'serif', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                                            {memory.title}
                                        </h3>
                                        <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                                            {memory.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <MemoryEditorSheet
                isOpen={!!editingMemoryId}
                onClose={() => setEditingMemoryId(null)}
                memoryId={editingMemoryId}
            />
        </div>
    );
}
