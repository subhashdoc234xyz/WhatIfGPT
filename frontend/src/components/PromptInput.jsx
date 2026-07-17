import React, { useState } from 'react';

function PromptInput({ onGenerate, loading, prompt: externalPrompt, setPrompt: setExternalPrompt }) {
  const [localPrompt, setLocalPrompt] = useState('');

  const prompt = externalPrompt !== undefined ? externalPrompt : localPrompt;
  const setPrompt = setExternalPrompt !== undefined ? setExternalPrompt : setLocalPrompt;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '1.5rem', padding: '32px' }}>
      <p className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 800 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.15))' }}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="url(#chat-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="chat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>
        Ask a Question
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <textarea
          className="input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your question or problem…"
          rows={4}
          disabled={loading}
          style={{ minHeight: '120px', backgroundColor: prompt.trim() ? '#ffffff' : undefined }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <span style={{ 
                width: 18, 
                height: 18, 
                border: '2.5px solid rgba(255, 255, 255, 0.2)', 
                borderTopColor: '#ffffff', 
                borderRadius: '50%', 
                animation: 'spin 0.7s linear infinite', 
                flexShrink: 0 
              }} />
              <span>Generating…</span>
            </>
          ) : '🚀 Generate Reasoning'}
        </button>
        <div className="dot-grid" style={{ marginTop: '8px', marginBottom: '-16px' }} />
      </form>
    </div>
  );
}

export default PromptInput;
