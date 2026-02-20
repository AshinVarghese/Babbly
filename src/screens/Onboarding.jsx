import React, { useState } from 'react';
import { useEvents } from '../store/EventContext';

export function Onboarding({ onNavigate }) {
    const { updateProfile } = useEvents();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [caretakerEmail, setCaretakerEmail] = useState('');
    const [caretakers, setCaretakers] = useState([]);
    const [isCelebrating, setIsCelebrating] = useState(false);

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
        else handleComplete();
    };

    const handleComplete = () => {
        setIsCelebrating(true);
        setTimeout(() => {
            updateProfile({ name, onboadingComplete: true });
            onNavigate('today');
        }, 800);
    };

    const addCaretaker = () => {
        if (caretakerEmail && !caretakers.includes(caretakerEmail)) {
            setCaretakers([...caretakers, caretakerEmail]);
            setCaretakerEmail('');
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', padding: '2rem 1.5rem', position: 'relative', zIndex: 10 }}>

            <button className="btn-icon" style={{ position: 'absolute', top: '2rem', left: '1rem', backgroundColor: 'transparent', border: 'none' }} onClick={() => onNavigate('auth-hub')}>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>←</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem', marginTop: '3rem' }}>
                {[1, 2].map(i => (
                    <div key={i} style={{
                        height: '6px',
                        width: step === i ? '24px' : '8px',
                        borderRadius: '3px',
                        backgroundColor: step === i ? 'var(--color-primary)' : 'var(--color-border)',
                        transition: 'all 0.3s var(--ease-spring)'
                    }} />
                ))}
            </div>

            <div className="card" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 500ms var(--ease-spring)',
                padding: '2rem 1.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '3.5rem', transition: 'all 0.3s ease' }}>
                    {step === 1 ? '👋' : '👨‍👩‍👧'}
                </div>

                <div style={{ flex: 1 }}>
                    {step === 1 && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', textAlign: 'center', marginBottom: '2rem' }}>
                                Let's meet baby!
                            </h2>
                            <p className="text-sm" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                What's your baby's name?
                            </p>

                            <input
                                type="text"
                                placeholder="..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-border)',
                                    backgroundColor: 'transparent',
                                    textAlign: 'center',
                                    padding: '0.5rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    color: 'var(--color-primary-dark)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', textAlign: 'center', marginBottom: '1rem' }}>
                                Invite the village
                            </h2>
                            <p className="text-sm" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                Add partners or babysitters to stay in sync. (Optional)
                            </p>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="email"
                                    placeholder="Enter email..."
                                    value={caretakerEmail}
                                    onChange={(e) => setCaretakerEmail(e.target.value)}
                                    className="styled-input"
                                    onKeyDown={(e) => e.key === 'Enter' && addCaretaker()}
                                />
                                <button className="btn btn-outline" onClick={addCaretaker}>Add</button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {caretakers.map((email, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'var(--color-primary-light)',
                                        color: 'var(--color-primary-dark)',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        animation: 'slideUp 0.2s var(--ease-spring)'
                                    }}>
                                        {email}
                                        <button
                                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                                            onClick={() => setCaretakers(caretakers.filter(c => c !== email))}
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        className={`btn ${step === 2 && isCelebrating ? 'btn-primary success-ripple' : 'btn-primary'} btn-full`}
                        onClick={handleNext}
                        disabled={step === 1 && !name.trim()}
                        style={{ padding: '1rem', borderRadius: '1rem', position: 'relative' }}
                    >
                        {step === 1 ? 'Next' : (isCelebrating ? 'Let\'s Go! 🎉' : 'Finish Setup')}
                        {isCelebrating && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                                pointerEvents: 'none', fontSize: '1.5rem', animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <span>✨</span><span>✨</span><span>✨</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
