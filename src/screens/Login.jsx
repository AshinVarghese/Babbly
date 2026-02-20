import React, { useState, useEffect } from 'react';
import { useEvents } from '../store/EventContext';

export function Login({ onNavigate }) {
    const { updateProfile } = useEvents();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        let timer;
        if (step === 2) {
            timer = setTimeout(() => setIsExpired(true), 15000); // 15 seconds for demo
        }
        return () => clearTimeout(timer);
    }, [step]);

    const handleContinue = () => {
        if (!email) {
            triggerError();
            return;
        }
        setStep(2);
        setIsExpired(false);
    };

    const handleLogin = () => {
        if (!code || isExpired) {
            triggerError();
            return;
        }
        setIsSuccess(true);
        setTimeout(() => {
            updateProfile({ onboadingComplete: true }); // Mock login success
            onNavigate('profiles');
        }, 600);
    };

    const triggerError = () => {
        setIsError(true);
        setTimeout(() => setIsError(false), 400);
    };

    if (isOffline) {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', justifyContent: 'center', padding: '1.5rem', position: 'relative', zIndex: 10 }}>
                <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: 'var(--shadow-lg)', animation: 'slideUp 500ms var(--ease-spring)', padding: '3rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 6s ease-in-out infinite' }}>☁️</div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Looks like you're offline.</h2>
                    <p className="text-sm" style={{ marginBottom: '2rem' }}>Babbly works without the internet, but you can't sign in right now.</p>
                    <button className="btn btn-primary btn-full" onClick={() => onNavigate('profiles')} style={{ padding: '1rem', borderRadius: '1rem' }}>Continue Offline</button>
                    <button className="btn btn-outline btn-full mt-4" onClick={() => onNavigate('auth-hub')} style={{ border: 'none', backgroundColor: 'transparent' }}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', justifyContent: 'center', padding: '1.5rem', position: 'relative', zIndex: 10 }}>

            <button className="btn-icon" style={{ position: 'absolute', top: '2rem', left: '1rem', backgroundColor: 'transparent', border: 'none' }} onClick={() => step === 2 ? setStep(1) : onNavigate('auth-hub')}>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>←</span>
            </button>

            <div className="card" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 500ms var(--ease-spring)',
                padding: '2rem 1.5rem',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
                    width: '48px', height: '48px', backgroundColor: 'var(--color-surface)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-primary-light)', fontSize: '1.5rem'
                }}>
                    🧸
                </div>

                {isExpired && step === 2 ? (
                    <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem', animation: 'fadeIn 0.3s' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>Code Expired</h2>
                        <p className="text-sm mt-2">That code ran out of time safely.</p>
                        <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setIsExpired(false); setCode(''); }}>Send new code</button>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>
                                {step === 1 ? 'Welcome back' : 'Check your email'}
                            </h2>
                            <p className="text-sm">
                                {step === 1 ? "What's your email or phone number?" : `Enter the secure code sent to ${email}`}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                            <div className={`input-container ${isError ? 'shake' : ''}`} style={{ transition: 'all 0.3s ease' }}>
                                {step === 1 ? (
                                    <input
                                        type="text"
                                        placeholder="Email or Phone"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="styled-input"
                                        autoFocus
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Secure Code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="styled-input"
                                        style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.25rem' }}
                                        autoFocus
                                    />
                                )}
                                {isSuccess && step === 2 && (
                                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)' }}>✓</span>
                                )}
                            </div>

                            <button
                                className={`btn btn-primary btn-full ${isSuccess ? 'success-ripple' : 'pulse-idle'}`}
                                onClick={step === 1 ? handleContinue : handleLogin}
                                style={{ padding: '1rem', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}
                            >
                                {step === 1 ? 'Continue' : 'Sign In'}
                            </button>

                            {step === 1 && (
                                <button className="btn btn-outline btn-full" style={{ border: 'none', backgroundColor: 'transparent', padding: '0.75rem' }} onClick={() => onNavigate('onboarding')}>
                                    Continue as guest caretaker
                                </button>
                            )}
                        </div>

                        {isError && (
                            <p className="text-xs" style={{ textAlign: 'center', color: 'var(--color-warning)', marginTop: '1rem', animation: 'fadeIn 0.2s' }}>
                                Oops, let's try that again.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
