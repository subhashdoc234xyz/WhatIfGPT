import React, { useState } from 'react';

function PromptInput({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="text-xl font-semibold mb-3">Ask a Question</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your question or problem..."
          className="glass-input w-full p-3 min-h-[100px] resize-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="glass-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </span>
          ) : (
            '🚀 Generate Reasoning'
          )}
        </button>
      </form>
    </div>
  );
}

export default PromptInput;
