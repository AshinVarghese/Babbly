import React, { useEffect, useState } from 'react';
import { IconX } from './Icons';

export function BottomSheet({ isOpen, onClose, children }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            // Add slight delay before unmounting to allow exit animation
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="modal-content" style={{ paddingBottom: '2rem' }} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-2">
                    <button className="btn-icon" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={onClose}>
                        <IconX />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
