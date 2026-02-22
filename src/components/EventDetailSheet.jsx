import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { useEvents } from '../store/EventContext';
import { IconFeed, IconDiaper, IconSleep, IconPump, IconNote, IconMedication, IconTemp, IconSun, IconBreast } from './Icons';

export function EventDetailSheet({ isOpen, onClose, logId }) {
    const { events, updateEvent, deleteEvent } = useEvents();
    const [editData, setEditData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const log = events.find(e => e.id === logId);

    useEffect(() => {
        if (log) {
            setEditData({ ...log.metadata });
        }
    }, [log]);

    if (!log || !editData) return null;

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateEvent(log.id, { metadata: editData });
            setIsSaving(false);
            onClose();
        }, 400); // simulate save micro-interaction
    };

    const handleDelete = () => {
        if (window.confirm("Delete this entry?")) {
            deleteEvent(log.id);
            onClose();
        }
    };

    const updateField = (key, value) => {
        setEditData(prev => ({ ...prev, [key]: value }));
    };

    const formatTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

    const renderEditableFields = () => {
        if (log.type === 'feed') {
            return (
                <div className="flex-col gap-4">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '8px' }}>
                        {['breast', 'bottle'].map(sub => (
                            <button key={sub} className="timeline-chip" style={{ margin: 0, backgroundColor: editData.subType === sub ? 'var(--color-primary)' : 'var(--color-surface)', color: editData.subType === sub ? '#fff' : 'inherit', cursor: 'pointer' }} onClick={() => updateField('subType', sub)}>
                                {sub === 'breast' ? 'Breast' : 'Bottle'}
                            </button>
                        ))}
                    </div>
                    {editData.subType === 'breast' ? (
                        <div className="flex gap-2">
                            {['left', 'right', 'both'].map(side => (
                                <button key={side} className="timeline-chip" style={{ margin: 0, backgroundColor: editData.side === side ? 'var(--color-primary)' : 'var(--color-surface)', color: editData.side === side ? '#fff' : 'inherit', cursor: 'pointer' }} onClick={() => updateField('side', side)}>
                                    {side.charAt(0).toUpperCase() + side.slice(1)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-col gap-2">
                            <label className="text-sm">Amount</label>
                            <input type="text" value={editData.amount || ''} onChange={(e) => updateField('amount', e.target.value)} placeholder="Amount (e.g. 4oz)" className="styled-input" style={{ width: '100%' }} />
                        </div>
                    )}

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Burped?</h4>
                    <div className="flex gap-2 mb-4">
                        <button className={`btn ${editData.burped === true ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('burped', true)}>Yes</button>
                        <button className={`btn ${editData.burped === false ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('burped', false)}>No</button>
                    </div>
                </div>
            );
        }
        if (log.type === 'diaper') {
            return (
                <div className="flex-col gap-4">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['wet', 'dirty', 'both', 'dry'].map(cond => (
                            <button key={cond} className="timeline-chip" style={{ margin: 0, backgroundColor: editData.condition === cond ? 'var(--color-primary)' : 'var(--color-surface)', color: editData.condition === cond ? '#fff' : 'inherit', cursor: 'pointer' }} onClick={() => updateField('condition', cond)}>
                                {cond.charAt(0).toUpperCase() + cond.slice(1)}
                            </button>
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase mt-2" style={{ color: 'var(--color-text-light)' }}>Color</h4>
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                        {[
                            { name: 'yellow', hex: '#ffd54f' },
                            { name: 'green', hex: '#81c784' },
                            { name: 'brown', hex: '#8d6e63' },
                            { name: 'black', hex: '#424242' },
                            { name: 'red', hex: '#e57373' }
                        ].map(c => (
                            <div key={c.name} onClick={() => updateField('color', c.name)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.hex, border: editData.color === c.name ? '3px solid var(--color-primary)' : '1px solid var(--color-border)', cursor: 'pointer', flexShrink: 0 }} />
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Texture</h4>
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                        {['watery', 'soft', 'formed', 'hard'].map(t => (
                            <button key={t} className={`btn ${editData.texture === t ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('texture', t)}>{t}</button>
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Amount</h4>
                    <div className="flex gap-2">
                        {['small', 'medium', 'large'].map(a => (
                            <button key={a} className={`btn ${editData.amountLevel === a ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem', fontSize: '0.875rem' }} onClick={() => updateField('amountLevel', a)}>{a}</button>
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Flags</h4>
                    <div className="flex gap-2 flex-wrap">
                        <button className={`btn ${editData.hasRash ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('hasRash', !editData.hasRash)}>Rash</button>
                        <button className={`btn ${editData.hasUnusualSmell ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('hasUnusualSmell', !editData.hasUnusualSmell)}>Unusual Smell</button>
                        <button className={`btn ${editData.isBlowout ? 'btn-danger' : 'btn-outline'} ${editData.isBlowout ? 'bg-danger text-white border-danger' : ''}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('isBlowout', !editData.isBlowout)}>Blowout</button>
                    </div>
                </div>
            );
        }
        if (log.type === 'pump') {
            return (
                <div className="flex-col gap-4">
                    <div className="flex gap-2 mb-2">
                        {['left', 'right', 'both'].map(s => (
                            <button key={s} className={`btn ${editData.side === s ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.5rem' }} onClick={() => updateField('side', s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                        ))}
                    </div>
                    <div className="flex-col gap-2">
                        <label className="text-sm">Total Amount</label>
                        <input type="text" className="styled-input" placeholder="e.g. 150ml or 5oz" value={editData.amount || ''} onChange={(e) => updateField('amount', e.target.value)} />
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase mt-2" style={{ color: 'var(--color-text-light)' }}>Pump Type</h4>
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                        {['manual', 'electric', 'wearable'].map(t => (
                            <button key={t} className={`btn ${editData.pumpType === t ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('pumpType', t)}>{t}</button>
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Storage</h4>
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                        {['fridge', 'freezer', 'immediate'].map(t => (
                            <button key={t} className={`btn ${editData.storage === t ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('storage', t)}>{t}</button>
                        ))}
                    </div>

                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Discomfort</h4>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(level => {
                            const emojis = { 1: '😌 None', 2: '🙁 Mild', 3: '😣 High' };
                            return <button key={level} className={`btn ${editData.discomfortLevel === level ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem', fontSize: '0.875rem' }} onClick={() => updateField('discomfortLevel', level)}>{emojis[level]}</button>
                        })}
                    </div>
                </div>
            );
        }
        if (log.type === 'sleep') {
            return (
                <div className="flex-col gap-4">
                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Location</h4>
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                        {['crib', 'bassinet', 'parent_bed', 'stroller', 'car'].map(l => (
                            <button key={l} className={`btn ${editData.location === l ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => updateField('location', l)}>{l.replace('_', ' ')}</button>
                        ))}
                    </div>
                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Quality</h4>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(q => (
                            <button key={q} className={`btn ${editData.quality === q ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.5rem', fontSize: '1rem' }} onClick={() => updateField('quality', q)}>{'⭐'.repeat(q)}</button>
                        ))}
                    </div>
                </div>
            );
        }
        if (log.type === 'note') {
            return (
                <textarea value={editData.text || ''} onChange={(e) => updateField('text', e.target.value)} className="styled-input" rows={3} placeholder="Add a note..."></textarea>
            );
        }
        if (log.type === 'medication') {
            return (
                <div className="flex-col gap-4">
                    <div className="flex-col gap-2">
                        <label className="text-sm">Medication Name</label>
                        <input type="text" className="styled-input" placeholder="e.g. Tylenol" value={editData.name || ''} onChange={(e) => updateField('name', e.target.value)} />
                    </div>
                    <div className="flex-col gap-2">
                        <label className="text-sm">Dose/Amount</label>
                        <input type="text" className="styled-input" placeholder="e.g. 2.5ml" value={editData.dose || ''} onChange={(e) => updateField('dose', e.target.value)} />
                    </div>
                </div>
            );
        }
        if (log.type === 'temp') {
            return (
                <div className="flex-col gap-4">
                    <div className="flex-col gap-2">
                        <label className="text-sm">Temperature</label>
                        <div className="flex gap-2">
                            <input type="number" step="0.1" className="styled-input flex-1" placeholder="e.g. 98.6" value={editData.value || ''} onChange={(e) => updateField('value', e.target.value)} />
                            <div className="flex gap-1" style={{ width: '80px' }}>
                                <button
                                    className={`btn ${editData.unit !== 'C' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                    onClick={() => updateField('unit', 'F')}
                                >F</button>
                                <button
                                    className={`btn ${editData.unit === 'C' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                    onClick={() => updateField('unit', 'C')}
                                >C</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return <p className="text-sm">Cannot inline-edit this event type yet.</p>;
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    <button className="btn-icon" onClick={handleDelete} style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--color-danger)' }}>🗑️</button>
                </div>
                <div className={`timeline-icon-wrap ${getColorClass(log.type)}`} style={{ margin: '0 auto 1rem auto', width: '64px', height: '64px' }}>
                    {getIcon(log.type, editData)}
                </div>
                <h2 style={{ textTransform: 'capitalize', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{log.type}</h2>
                <p className="text-sm">{formatTime(log.startTime)}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-sm" style={{ marginBottom: '0.5rem', color: 'var(--color-text-light)' }}>Details</h3>
                {renderEditableFields()}

                <h3 className="text-sm" style={{ marginBottom: '0.5rem', color: 'var(--color-text-light)', marginTop: '1.5rem' }}>Notes</h3>
                <textarea
                    value={editData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="styled-input"
                    rows={2}
                    placeholder="Optional notes..."
                    style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                />
            </div>

            <button
                className={`btn btn-primary btn-full ${isSaving ? 'success-ripple' : ''}`}
                onClick={handleSave}
            >
                {isSaving ? 'Saved ✓' : 'Save Details'}
            </button>
            <p className="text-xs" style={{ textAlign: 'center', marginTop: '1rem' }}>Logged by {log.caretakerId || 'Primary Caretaker'}</p>
        </BottomSheet>
    );
}
