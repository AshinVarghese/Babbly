import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from './BottomSheet';
import { useMemories } from '../store/MemoryContext';

export function MemoryEditorSheet({ isOpen, onClose, memoryId }) {
    const { memories, updateMemory, deleteMemory } = useMemories();
    const [editData, setEditData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const memory = memories.find(m => m.id === memoryId);

    useEffect(() => {
        if (memory) {
            setEditData({ title: memory.title, content: memory.content, mediaRef: memory.mediaRef });
        }
    }, [memory]);

    if (!memory || !editData) return null;

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateMemory(memory.id, editData);
            setIsSaving(false);
            onClose();
        }, 400); // simulate micro-interaction
    };

    const handleDelete = () => {
        if (window.confirm("Remove this memory from your journal?")) {
            deleteMemory(memory.id);
            onClose();
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // In a production app, we would compress this via canvas before saving to IndexedDB 
                // to avoid blowing up the storage quota quickly.
                setEditData(prev => ({ ...prev, mediaRef: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Edit Memory">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

                {/* Photo Section */}
                <div>
                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Photo</h4>

                    {editData.mediaRef ? (
                        <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--color-surface)', marginBottom: '0.5rem' }}>
                            <img src={editData.mediaRef} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                onClick={() => setEditData(prev => ({ ...prev, mediaRef: null }))}
                                style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{ width: '100%', height: '120px', borderRadius: '16px', border: '2px dashed var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: 'var(--color-bg)' }}
                        >
                            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Add a photo</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Text Section */}
                <div>
                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Title</h4>
                    <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="styled-input"
                        style={{ width: '100%', fontFamily: 'serif', fontSize: '1.25rem' }}
                    />
                </div>

                <div>
                    <h4 className="text-sm mb-2 text-transform-uppercase" style={{ color: 'var(--color-text-light)' }}>Story</h4>
                    <textarea
                        value={editData.content || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                        className="styled-input"
                        style={{ width: '100%', minHeight: '100px', resize: 'vertical', lineHeight: 1.5 }}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <span className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px', borderColor: '#fff', borderBottomColor: 'transparent' }}></span> : 'Save Memory'}
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={handleDelete}
                        style={{ background: 'none', border: 'none', color: 'var(--color-warning)', fontSize: '0.875rem', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        Delete Memory
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
}
