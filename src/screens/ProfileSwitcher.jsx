import React, { useState } from 'react';
import { useEvents } from '../store/EventContext';

export function ProfileSwitcher({ onNavigate }) {
    const { profile } = useEvents();
    const [selected, setSelected] = useState('current');
    const [isExpanding, setIsExpanding] = useState(false);

    const handleSelect = () => {
        setIsExpanding(true);
        setTimeout(() => {
            onNavigate('today');
        }, 500);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>

            <button className="btn-icon" style={{ position: 'absolute', top: '2rem', left: '1rem', backgroundColor: 'transparent', border: 'none', zIndex: 10 }} onClick={() => onNavigate('auth-hub')}>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>←</span>
            </button>

            <div style={{ animation: 'slideUp 500ms var(--ease-spring)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ marginBottom: '3rem', fontSize: '1.5rem', color: 'var(--color-text)' }}>Who's logging today?</h2>

                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '1rem', scrollSnapType: 'x mandatory', width: '100%', justifyContent: 'center' }}>

                    {/* Primary Avatar */}
                    <div
                        onClick={handleSelect}
                        style={{
                            scrollSnapAlign: 'center',
                            width: '140px', height: '140px', borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-light)',
                            border: selected === 'current' ? '4px solid var(--color-primary)' : '4px solid transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem', cursor: 'pointer',
                            boxShadow: selected === 'current' ? '0 0 24px rgba(134, 185, 176, 0.4)' : 'var(--shadow-md)',
                            transition: 'all 0.4s var(--ease-spring)',
                            transform: isExpanding ? 'scale(10)' : 'scale(1)',
                            zIndex: isExpanding ? 50 : 1,
                            color: 'var(--color-primary-dark)'
                        }}>
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'B'}
                    </div>

                    {/* Add Caretaker/Profile button */}
                    <div
                        onClick={() => onNavigate('onboarding')}
                        style={{
                            scrollSnapAlign: 'center',
                            width: '140px', height: '140px', borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                            border: '2px dashed var(--color-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', cursor: 'pointer', color: 'var(--color-text-light)',
                            opacity: isExpanding ? 0 : 1, transition: 'opacity 0.2s',
                            flexShrink: 0
                        }}>
                        +
                    </div>
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', opacity: isExpanding ? 0 : 1, transition: 'opacity 0.2s', animation: 'fadeIn 0.6s ease' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text)', margin: 0, fontWeight: 700 }}>{profile.name || 'Baby'}</h1>
                    <p className="text-sm" style={{ marginTop: '0.5rem' }}>Tap to continue</p>
                </div>
            </div>

            {/* Expanded backdrop to cover the screen quickly */}
            {isExpanding && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'var(--color-primary-light)',
                    animation: 'fadeIn 0.3s ease forwards',
                    zIndex: 20
                }} />
            )}
        </div>
    );
}
