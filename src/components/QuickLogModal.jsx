import React, { useState, useEffect } from 'react';
import { useEvents } from '../store/EventContext';
import { IconFeed, IconDiaper, IconSleep, IconPump, IconNote, IconMedication, IconTemp } from './Icons';
import { BottomSheet } from './BottomSheet';

export function QuickLogModal({ isOpen, onClose, defaultType }) {
    const { addEvent } = useEvents();
    const [activeType, setActiveType] = useState(null); // feed, diaper, sleep, pump, med, temp, note
    const [details, setDetails] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setActiveType(null);
            setDetails({});
            setIsSaving(false);
            setShowAdvanced(false);
        } else if (defaultType && defaultType !== 'all') {
            setActiveType(defaultType);
            setShowAdvanced(false);
        }
    }, [isOpen, defaultType]);

    const handleSave = () => {
        if (!activeType) return;
        setIsSaving(true);
        setTimeout(() => {
            let endTime = null;
            if (activeType === 'sleep' && details.duration) {
                endTime = new Date(Date.now() + details.duration).toISOString();
            }
            addEvent(activeType, details, null, endTime);
            onClose();
        }, 300); // Artificial delay to show "saving" animation/haptic feedback feel
    };

    const renderTypeSelector = () => (
        <>
            <h2 className="mb-4">Log Activity</h2>
            <div className="picker-grid mb-4">
                <div className="picker-item" onClick={() => setActiveType('feed')}>
                    <IconFeed className="icon-feed" /> <span>Feed</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('diaper')}>
                    <IconDiaper className="icon-diaper" /> <span>Diaper</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('sleep')}>
                    <IconSleep className="icon-sleep" /> <span>Sleep</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('pump')}>
                    <IconPump className="icon-pump" /> <span>Pump</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('medication')}>
                    <IconMedication style={{ color: '#8e24aa' }} /> <span>Medication</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('temp')}>
                    <IconTemp style={{ color: '#e53935' }} /> <span>Temp</span>
                </div>
                <div className="picker-item" onClick={() => setActiveType('note')} style={{ gridColumn: 'span 2' }}>
                    <IconNote style={{ color: '#00897b' }} /> <span>Note</span>
                </div>
            </div>
        </>
    );

    const renderDetailsForm = () => {
        switch (activeType) {
            case 'feed':
                return (
                    <div className="flex-col gap-4 mb-4">
                        <h3 className="mb-2">Feed Details</h3>
                        <div className="flex gap-2">
                            <button
                                className={`btn ${details.subType === 'breast' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                onClick={() => setDetails({ ...details, subType: 'breast' })}
                            >Breast</button>
                            <button
                                className={`btn ${details.subType === 'bottle' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                onClick={() => setDetails({ ...details, subType: 'bottle' })}
                            >Bottle</button>
                        </div>
                        {details.subType === 'breast' && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    className={`btn ${details.side === 'left' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                    onClick={() => setDetails({ ...details, side: 'left' })}
                                >Left</button>
                                <button
                                    className={`btn ${details.side === 'right' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                    onClick={() => setDetails({ ...details, side: 'right' })}
                                >Right</button>
                                <button
                                    className={`btn ${details.side === 'both' ? 'btn-primary' : 'btn-outline'} flex-1`}
                                    onClick={() => setDetails({ ...details, side: 'both' })}
                                >Both</button>
                            </div>
                        )}
                        {details.subType === 'bottle' && (
                            <div className="flex-col gap-2 mt-2">
                                <label className="text-sm">Amount</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 120ml or 4oz"
                                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', width: '100%' }}
                                    onChange={(e) => setDetails({ ...details, amount: e.target.value })}
                                />
                            </div>
                        )}

                        {details.subType && !showAdvanced ? (
                            <button className="btn btn-outline mt-2" style={{ padding: '0.25rem', fontSize: '0.875rem', border: 'none', color: 'var(--color-primary)' }} onClick={() => setShowAdvanced(true)}>
                                + Add details (burped, pace...)
                            </button>
                        ) : details.subType && showAdvanced ? (
                            <div className="advanced-panel mt-4" style={{ animation: 'slideUp 0.3s' }}>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Burped?</h4>
                                <div className="flex gap-2 mb-4">
                                    <button className={`btn ${details.burped === true ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, burped: true })}>Yes</button>
                                    <button className={`btn ${details.burped === false ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, burped: false })}>No</button>
                                </div>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Notes</h4>
                                <textarea rows="2" className="styled-input w-full" value={details.notes || ''} onChange={(e) => setDetails({ ...details, notes: e.target.value })} placeholder="Add a note..."></textarea>
                            </div>
                        ) : null}
                    </div>
                );
            case 'diaper':
                return (
                    <div className="flex-col gap-4 mb-4">
                        <h3 className="mb-2">Diaper Details</h3>
                        <div className="picker-grid">
                            <div className={`picker-item ${details.condition === 'wet' ? 'active' : ''}`} onClick={() => setDetails({ ...details, condition: 'wet' })}>
                                <span>💧 Wet</span>
                            </div>
                            <div className={`picker-item ${details.condition === 'dirty' ? 'active' : ''}`} onClick={() => setDetails({ ...details, condition: 'dirty' })}>
                                <span>💩 Dirty</span>
                            </div>
                            <div className={`picker-item ${details.condition === 'both' ? 'active' : ''}`} style={{ gridColumn: 'span 2' }} onClick={() => setDetails({ ...details, condition: 'both' })}>
                                <span>💧 + 💩 Both</span>
                            </div>
                        </div>

                        {!showAdvanced ? (
                            <button className="btn btn-outline mt-2" style={{ padding: '0.25rem', fontSize: '0.875rem', border: 'none', color: 'var(--color-primary)' }} onClick={() => setShowAdvanced(true)}>
                                + Add details (color, texture...)
                            </button>
                        ) : (
                            <div className="advanced-panel mt-4" style={{ animation: 'slideUp 0.3s' }}>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Color</h4>
                                <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                                    {[
                                        { name: 'yellow', hex: '#ffd54f' },
                                        { name: 'green', hex: '#81c784' },
                                        { name: 'brown', hex: '#8d6e63' },
                                        { name: 'black', hex: '#424242' },
                                        { name: 'red', hex: '#e57373' }
                                    ].map(c => (
                                        <div key={c.name} onClick={() => setDetails({ ...details, color: c.name })} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.hex, border: details.color === c.name ? '3px solid var(--color-primary)' : '1px solid var(--color-border)', cursor: 'pointer', flexShrink: 0 }} />
                                    ))}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Texture</h4>
                                <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                                    {['watery', 'soft', 'formed', 'hard'].map(t => (
                                        <button key={t} className={`btn ${details.texture === t ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', flexShrink: 0 }} onClick={() => setDetails({ ...details, texture: t })}>{t}</button>
                                    ))}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Amount</h4>
                                <div className="flex gap-2 mb-4">
                                    {['small', 'medium', 'large'].map(a => (
                                        <button key={a} className={`btn ${details.amountLevel === a ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, amountLevel: a })}>{a}</button>
                                    ))}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Flags</h4>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    <button className={`btn ${details.hasRash ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, hasRash: !details.hasRash })}>Rash</button>
                                    <button className={`btn ${details.hasUnusualSmell ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, hasUnusualSmell: !details.hasUnusualSmell })}>Unusual Smell</button>
                                    <button className={`btn ${details.isBlowout ? 'btn-danger' : 'btn-outline'} ${details.isBlowout ? 'bg-danger text-white border-danger' : ''}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, isBlowout: !details.isBlowout })}>Blowout</button>
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Notes</h4>
                                <textarea rows="2" className="styled-input w-full" value={details.notes || ''} onChange={(e) => setDetails({ ...details, notes: e.target.value })} placeholder="Add a note..."></textarea>
                            </div>
                        )}
                    </div>
                );
            case 'pump':
                return (
                    <div className="flex-col gap-4 mb-4">
                        <h3 className="mb-2">Pump Session</h3>
                        <div className="flex gap-2 mb-2">
                            {['left', 'right', 'both'].map(s => (
                                <button key={s} className={`btn ${details.side === s ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.5rem' }} onClick={() => setDetails({ ...details, side: s })}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                            ))}
                        </div>
                        <div className="flex-col gap-2">
                            <label className="text-sm">Total Amount</label>
                            <input type="text" className="styled-input" placeholder="e.g. 150ml or 5oz" value={details.amount || ''} onChange={(e) => setDetails({ ...details, amount: e.target.value })} />
                        </div>

                        {!showAdvanced ? (
                            <button className="btn btn-outline mt-2" style={{ padding: '0.25rem', fontSize: '0.875rem', border: 'none', color: 'var(--color-primary)' }} onClick={() => setShowAdvanced(true)}>
                                + Add details (pump type, storage...)
                            </button>
                        ) : (
                            <div className="advanced-panel mt-4" style={{ animation: 'slideUp 0.3s' }}>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Pump Type</h4>
                                <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                                    {['manual', 'electric', 'wearable'].map(t => (
                                        <button key={t} className={`btn ${details.pumpType === t ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, pumpType: t })}>{t}</button>
                                    ))}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Storage</h4>
                                <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                                    {['fridge', 'freezer', 'immediate'].map(t => (
                                        <button key={t} className={`btn ${details.storage === t ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, storage: t })}>{t}</button>
                                    ))}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Discomfort</h4>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3].map(level => {
                                        const emojis = { 1: '😌 None', 2: '🙁 Mild', 3: '😣 High' };
                                        return <button key={level} className={`btn ${details.discomfortLevel === level ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, discomfortLevel: level })}>{emojis[level]}</button>
                                    })}
                                </div>

                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Notes</h4>
                                <textarea rows="2" className="styled-input w-full" value={details.notes || ''} onChange={(e) => setDetails({ ...details, notes: e.target.value })} placeholder="Add a note..."></textarea>
                            </div>
                        )}
                    </div>
                );
            case 'sleep':
                return (
                    <div className="flex-col gap-4 mb-4">
                        <h3 className="mb-2">Sleep Log</h3>
                        <p className="text-sm mb-4">Usually, you'd start a timer. For quick manual entry, enter duration.</p>
                        <div className="flex gap-2 mb-4">
                            <button
                                className={`btn ${details.duration === 1800000 ? 'btn-primary' : 'btn-outline'} flex-1`}
                                onClick={() => setDetails({ ...details, duration: 1800000 })} // 30m
                            >30 m</button>
                            <button
                                className={`btn ${details.duration === 3600000 ? 'btn-primary' : 'btn-outline'} flex-1`}
                                onClick={() => setDetails({ ...details, duration: 3600000 })} // 1h
                            >1 hr</button>
                            <button
                                className={`btn ${details.duration === 7200000 ? 'btn-primary' : 'btn-outline'} flex-1`}
                                onClick={() => setDetails({ ...details, duration: 7200000 })} // 2h
                            >2 hr</button>
                        </div>

                        {!showAdvanced ? (
                            <button className="btn btn-outline mt-2" style={{ padding: '0.25rem', fontSize: '0.875rem', border: 'none', color: 'var(--color-primary)' }} onClick={() => setShowAdvanced(true)}>
                                + Add details (location, quality...)
                            </button>
                        ) : (
                            <div className="advanced-panel mt-4" style={{ animation: 'slideUp 0.3s' }}>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Location</h4>
                                <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                                    {['crib', 'bassinet', 'parent_bed', 'stroller', 'car'].map(l => (
                                        <button key={l} className={`btn ${details.location === l ? 'btn-primary' : 'btn-outline'} flex-shrink-0`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setDetails({ ...details, location: l })}>{l.replace('_', ' ')}</button>
                                    ))}
                                </div>
                                <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Quality</h4>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map(q => (
                                        <button key={q} className={`btn ${details.quality === q ? 'btn-primary' : 'btn-outline'} flex-1`} style={{ padding: '0.25rem 0.5rem', fontSize: '1rem' }} onClick={() => setDetails({ ...details, quality: q })}>{'⭐'.repeat(q)}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'note':
                return (
                    <div className="flex-col gap-2 mb-4">
                        <h3 className="mb-2">Add Note</h3>
                        <textarea
                            rows="4"
                            placeholder="Write a note here..."
                            className="styled-input w-full"
                            style={{ fontFamily: 'inherit' }}
                            onChange={(e) => setDetails({ text: e.target.value })}
                        />
                    </div>
                );
            // Other types like Pump, Med, Temp can follow short similar flows
            default:
                return (
                    <div className="flex-col gap-2 mb-4">
                        <h3 className="mb-2 text-transform-capitalize">{activeType} Details</h3>
                        <p className="text-sm">Standard entry for {activeType}</p>
                    </div>
                );
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div style={{ transition: 'all 0.3s ease-in-out', transform: activeType ? 'translateY(0)' : 'translateY(10px)', opacity: 1 }}>
                {activeType && (
                    <button className="btn btn-outline mb-4" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setActiveType(null)}>
                        ← Back
                    </button>
                )}

                {!activeType ? renderTypeSelector() : renderDetailsForm()}

                {activeType && (
                    <button className="btn btn-primary btn-full mt-4" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Logging...' : 'Save Log'}
                    </button>
                )}
            </div>
        </BottomSheet>
    );
}
