import React, { useState } from 'react';

function NodeEditor({ step, onSave, onClose }) {
  const [editedText, setEditedText] = useState(step.stepText);

  const handleSave = () => {
    onSave({ ...step, stepText: editedText });
  };

  return (
    <div className="modal-backdrop">
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #C4B5FD', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E1B2E' }}>
            {step.isConclusion ? '🎯 Edit Conclusion' : `✏️ Edit Step ${step.id}`}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.8rem', color: '#6B7280', lineHeight: 1, opacity: 0.8, padding: '4px' }}
          >
            ×
          </button>
        </div>

        {/* Original */}
        <div style={{ marginBottom: '24px' }}>
          <p className="section-title">
            Original Text
          </p>
          <div style={{ background: '#FAF9FF', border: '1px solid #E9E5FF', borderRadius: '12px', padding: '16px', fontSize: '0.9rem', color: '#6B7280', fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {step.stepText}
          </div>
        </div>

        {/* Edit */}
        <div style={{ marginBottom: '24px' }}>
          <p className="section-title">
            Edit Assumption
          </p>
          <textarea
            className="input"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Change the assumption or content…"
            rows={5}
            style={{ minHeight: '150px', backgroundColor: '#ffffff' }}
          />
        </div>

        {/* Info banner */}
        <div style={{ background: '#F3F0FF', border: '1px solid #C4B5FD', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600, lineHeight: 1.5 }}>
            💡 Saving this edit will create a new branch. The AI will re-reason from this point forward with your changed assumption.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!editedText.trim()}
            style={{ flex: 1 }}
          >
            🔄 Save & Create Branch
          </button>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '14px 24px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NodeEditor;
