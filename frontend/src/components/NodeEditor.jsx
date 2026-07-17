import React, { useState } from 'react';

function NodeEditor({ step, onSave, onClose }) {
  const [editedText, setEditedText] = useState(step.stepText);

  const handleSave = () => {
    const updatedStep = {
      ...step,
      stepText: editedText,
    };
    onSave(updatedStep);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold">
              {step.isConclusion ? '🎯 Edit Conclusion' : `✏️ Edit Step ${step.id}`}
            </h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 opacity-80">
              Original Text:
            </label>
            <div className="glass-card p-3 text-sm text-white/70 whitespace-pre-wrap">
              {step.stepText}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 opacity-80">
              Edit Assumption / Content:
            </label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="glass-input w-full p-4 min-h-[150px] resize-none"
              placeholder="Change the assumption or content..."
            />
          </div>

          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2">💡 What happens next?</h4>
            <p className="text-sm text-white/80">
              When you save this edit, a new branch will be created. The AI will re-run its reasoning 
              from this point forward with your changed assumption, allowing you to see how different 
              assumptions lead to different conclusions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!editedText.trim()}
              className="glass-button flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Save & Create Branch
            </button>
            <button
              onClick={onClose}
              className="glass-button py-3 px-6 bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeEditor;
