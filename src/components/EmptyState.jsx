import React from 'react';

export function EmptyState({ message, subMessage }) {
    return (
        <div className="card mt-4" style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeIn var(--duration-normal) var(--ease-smooth)'
        }}>
            <div style={{ fontSize: '3rem', opacity: 0.8 }}>🌟</div>
            <div>
                <p className="text-sm" style={{ fontWeight: 600 }}>{message}</p>
                {subMessage && <p className="text-xs mt-2">{subMessage}</p>}
            </div>
        </div>
    );
}
