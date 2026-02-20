import React from 'react';
import { useEvents } from '../store/EventContext';

import { exportService } from '../services/exportService';
import { reminderService } from '../services/reminderService';

export function Settings({ onBack }) {
    const { profile, updateProfile, events } = useEvents();

    const handleExportCSV = () => {
        exportService.downloadCSV(events, 'babbly_export.csv');
    };

    const handleExportPDF = () => {
        exportService.downloadPDF(events, profile, 'babbly_summary.pdf');
    };

    const handleTestReminder = async () => {
        const granted = await reminderService.requestPermission();
        if (granted) {
            reminderService.scheduleReminder(
                'Babbly Reminder',
                { body: 'This is a test reminder from Babbly!' },
                5000 // 5 seconds test
            );
            alert('Reminder scheduled for 5 seconds from now!');
        } else {
            alert('Notification permission denied.');
        }
    };

    return (
        <div className="app-container">
            <div className="flex justify-between items-center mt-2 mb-4">
                <h1 style={{ marginBottom: 0 }}>Settings</h1>
                <button className="btn-icon" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', width: 40, height: 40, cursor: 'pointer' }} onClick={onBack}>
                    <span style={{ fontSize: '1.25rem' }}>✕</span>
                </button>
            </div>

            <div className="card mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2>Baby Profile</h2>
                <div>
                    <label className="text-sm">Name</label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={e => updateProfile({ name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginTop: '0.25rem' }}
                    />
                </div>
                <div>
                    <label className="text-sm">Date of Birth</label>
                    <input
                        type="date"
                        value={profile.dob}
                        onChange={e => updateProfile({ dob: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginTop: '0.25rem' }}
                    />
                </div>
            </div>

            <div className="card mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2>Export Data</h2>
                <p className="text-sm text-light mb-2">Export your baby's data for pediatric visits or personal backup.</p>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={handleExportCSV}>
                    <span style={{ marginRight: '0.5rem' }}>📊</span> Export as CSV
                </button>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={handleExportPDF}>
                    <span style={{ marginRight: '0.5rem' }}>📄</span> Export as PDF
                </button>
            </div>

            <div className="card mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2>Reminders & Sharing</h2>
                <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={handleTestReminder}>
                    <span style={{ marginRight: '0.5rem' }}>🔔</span> Test Web Notification (5s)
                </button>
                <button className="btn btn-outline" disabled style={{ justifyContent: 'flex-start', opacity: 0.5 }}>
                    <span style={{ marginRight: '0.5rem' }}>👨‍👩‍👧</span> Invite Caretaker (Coming Soon)
                </button>
            </div>

        </div>
    );
}
