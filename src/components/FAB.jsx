import React, { useState } from 'react';
import { useEvents } from '../store/EventContext';
import { intelligenceEngine } from '../services/intelligenceEngine';
import { IconPlus, IconFeed, IconDiaper, IconSleep } from './Icons';

export function FAB({ onClick, onPredictClick }) {
    const { events } = useEvents();
    const [isHovered, setIsHovered] = useState(false);

    const prediction = intelligenceEngine.predictNextActivity(events);

    const getPredictionIcon = (type) => {
        if (type === 'feed') return <IconFeed />;
        if (type === 'diaper') return <IconDiaper />;
        if (type === 'sleep') return <IconSleep />;
        return null;
    };

    return (
        <div className="fab-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {prediction && (
                <div
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transform: isHovered ? 'translateY(-4px)' : 'none',
                        transition: 'transform 0.2s',
                        border: '1px solid var(--color-primary-light)',
                        animation: 'slideUp 0.3s ease-out',
                        pointerEvents: 'auto'
                    }}
                    onClick={() => {
                        if (onPredictClick) onPredictClick(prediction.type);
                        else onClick();
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div style={{ color: `var(--color-${prediction.type})`, display: 'flex' }}>
                        {React.cloneElement(getPredictionIcon(prediction.type), { width: 16, height: 16 })}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{prediction.label}</span>
                </div>
            )}
            <button className="fab" onClick={onClick} aria-label="Quick Log" style={{ position: 'static', pointerEvents: 'auto' }}>
                <IconPlus />
            </button>
        </div>
    );
}
