import React from 'react';

export function AuthHub({ onNavigate }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'flex-end', padding: '1.5rem', position: 'relative', zIndex: 10, width: '100%' }}>

            <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, textAlign: 'center', animation: 'fadeIn var(--duration-normal) var(--ease-smooth)' }}>
                <div style={{ fontSize: '5rem', animation: 'float 6s ease-in-out infinite' }}>🧸</div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: 'var(--color-primary-dark)' }}>babbly</h1>
                <p className="text-sm" style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--color-text-light)' }}>Your baby's calm companion.</p>
            </div>

            <div className="card" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 600ms var(--ease-spring)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                padding: '1.5rem'
            }}>
                <p className="text-xs" style={{ textAlign: 'center', marginBottom: '-0.25rem', fontWeight: 600, color: 'var(--color-text-light)', opacity: 0.8 }}>
                    Trusted by parents. Built for tired eyes.
                </p>
                <button className="btn btn-primary btn-full" onClick={() => onNavigate('onboarding')} style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '1rem' }}>
                    Get Started
                </button>
                <button className="btn btn-outline btn-full" onClick={() => onNavigate('login')} style={{ border: 'none', backgroundColor: 'transparent', padding: '1rem', fontSize: '1.1rem' }}>
                    Sign In
                </button>
                <p className="text-xs" style={{ textAlign: 'center', margin: 0, opacity: 0.6 }}>
                    Tap 'Share' &gt; 'Add to Home Screen' for the best experience.
                </p>
            </div>
        </div>
    );
}
