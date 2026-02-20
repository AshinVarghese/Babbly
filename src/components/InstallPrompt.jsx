import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        setIsVisible(false);
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div className="card mt-4 mb-4" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary)',
            animation: 'fadeIn var(--duration-normal) var(--ease-smooth)'
        }}>
            <div className="flex items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Get the Babbly App</h3>
                    <p className="text-xs" style={{ margin: 0, opacity: 0.8 }}>Install for quick access and offline use.</p>
                </div>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={handleInstallClick}>
                Install
            </button>
        </div>
    );
}
