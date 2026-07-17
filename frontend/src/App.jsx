import React, { useState } from 'react';
import PromptInput from './components/PromptInput';
import ReasoningTree from './components/ReasoningTree';
import NodeEditor from './components/NodeEditor';
import BranchCompare from './components/BranchCompare';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BRANCH_COLORS = [
  '#8B5CF6', // Violet-500 (Original)
  '#818CF8', // Indigo-400 (Fork A)
  '#6366F1', // Indigo-500 (Fork B)
  '#A78BFA', // Violet-300/400 (Fork C)
  '#4F46E5', // Indigo-600 (Fork D)
  '#7C3AED', // Violet-600 (Fork E)
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [branches, setBranches] = useState([]);
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareBranches, setCompareBranches] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [finalConclusion, setFinalConclusion] = useState(null);
  const [loadingFinal, setLoadingFinal] = useState(false);

  const fetchSuggestions = async (userPrompt, steps) => {
    setLoadingSuggestions(true);
    try {
      const activeSteps = steps.filter(s => !s.isConclusion);
      const response = await fetch(`${API_URL}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, steps: activeSteps }),
      });
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddSuggestion = async (text) => {
    if (!activeBranchId) return;
    const activeBranch = branches.find(b => b.id === activeBranchId);
    if (!activeBranch) return;

    const currentSteps = activeBranch.steps.filter(s => !s.isConclusion);
    const lastStep = currentSteps[currentSteps.length - 1];
    const nextId = lastStep ? lastStep.id + 1 : 1;

    const newStep = {
      id: nextId,
      stepText: text,
      dependsOn: lastStep ? lastStep.id : null,
      isConclusion: false
    };

    const updatedSteps = [...currentSteps, newStep];

    const updatedBranches = branches.map(b => {
      if (b.id === activeBranchId) {
        return {
          ...b,
          steps: updatedSteps,
          conclusion: "" // Clear conclusion since we added a new step
        };
      }
      return b;
    });
    setBranches(updatedBranches);
    setFinalConclusion(null);

    fetchSuggestions(activeBranch.prompt, updatedSteps);
  };

  const handleFinishReasoning = async () => {
    if (!activeBranchId) return;
    const activeBranch = branches.find(b => b.id === activeBranchId);
    if (!activeBranch) return;

    setLoadingFinal(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activeBranch.prompt,
          steps: activeBranch.steps.filter(s => !s.isConclusion),
        }),
      });
      if (!response.ok) throw new Error('Failed to generate final conclusion');
      const data = await response.json();

      const currentSteps = activeBranch.steps.filter(s => !s.isConclusion);
      const lastStep = currentSteps[currentSteps.length - 1];
      const nextId = lastStep ? lastStep.id + 1 : 1;

      const conclusionStep = {
        id: nextId,
        stepText: data.conclusion,
        dependsOn: lastStep ? lastStep.id : null,
        isConclusion: true
      };

      const updatedBranches = branches.map(b => {
        if (b.id === activeBranchId) {
          return {
            ...b,
            steps: [...currentSteps, conclusionStep],
            conclusion: data.conclusion
          };
        }
        return b;
      });
      setBranches(updatedBranches);
      setFinalConclusion(data.conclusion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFinal(false);
    }
  };

  React.useEffect(() => {
    if (activeBranchId) {
      const activeBranch = branches.find(b => b.id === activeBranchId);
      if (activeBranch) {
        setFinalConclusion(activeBranch.conclusion || null);
        fetchSuggestions(activeBranch.prompt, activeBranch.steps);
      }
    } else {
      setSuggestions([]);
      setFinalConclusion(null);
    }
  }, [activeBranchId, branches]);

  const handleGenerateReasoning = async (userPrompt) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (!response.ok) throw new Error('Failed to generate reasoning');
      const data = await response.json();
      const newBranch = {
        id: Date.now(),
        prompt: userPrompt,
        steps: data.steps,
        conclusion: data.conclusion,
        parentId: null,
        editedStepId: null,
        color: BRANCH_COLORS[0],
      };
      setBranches([newBranch]);
      setActiveBranchId(newBranch.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFork = async (editedStep) => {
    if (!activeBranchId) return;
    setLoading(true);
    setError(null);
    try {
      const activeBranch = branches.find(b => b.id === activeBranchId);
      const stepIndex = activeBranch.steps.findIndex(s => s.id === editedStep.id);
      const stepsBeforeEdit = activeBranch.steps.slice(0, stepIndex + 1);
      stepsBeforeEdit[stepIndex] = editedStep;
      const response = await fetch(`${API_URL}/api/fork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activeBranch.prompt,
          edited_step: editedStep,
          steps_before_edit: stepsBeforeEdit,
        }),
      });
      if (!response.ok) throw new Error('Failed to fork reasoning');
      const data = await response.json();
      const newBranch = {
        id: Date.now(),
        prompt: activeBranch.prompt,
        steps: data.steps,
        conclusion: data.conclusion,
        parentId: activeBranchId,
        editedStepId: editedStep.id,
        color: BRANCH_COLORS[(branches.length) % BRANCH_COLORS.length],
      };
      setBranches([...branches, newBranch]);
      setActiveBranchId(newBranch.id);
      setSelectedNode(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (compareBranches.length < 2) return;
    setLoading(true);
    try {
      const branch1 = branches.find(b => b.id === compareBranches[0]);
      const branch2 = branches.find(b => b.id === compareBranches[1]);
      const response = await fetch(`${API_URL}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch1_steps: branch1.steps,
          branch1_conclusion: branch1.conclusion,
          branch2_steps: branch2.steps,
          branch2_conclusion: branch2.conclusion,
        }),
      });
      if (!response.ok) throw new Error('Failed to compare branches');
      const data = await response.json();
      setComparison(data.comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeBranch = branches.find(b => b.id === activeBranchId);
  const hasBranches = branches.length > 0;

  const examplePrompts = [
    { icon: '🚀', text: 'Should I launch this product in Q1 or Q2?' },
    { icon: '🏠', text: 'Is it better to rent or buy a home?' },
    { icon: '💼', text: 'Should I accept this job offer?' },
    { icon: '💻', text: "What's the best approach to learn programming?" },
  ];

  return (
    <div className="app-container">
      {/* Background Aurora Blobs */}
      <div className="aurora-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <header className="app-header">
        <h1 className="app-title">
          <span className="sparkle-icon">✨</span> WhatIfGPT
        </h1>
        <p className="app-subtitle">
          Don't just read reasoning — fork it, edit it, and watch the answer change.
        </p>
      </header>

      <main className="app-main">
        {!hasBranches ? (
          <div className="welcome-container">
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <PromptInput
              onGenerate={handleGenerateReasoning}
              loading={loading}
              prompt={prompt}
              setPrompt={setPrompt}
            />

            {loading ? (
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="spinner" />
                <p style={{ marginTop: '20px', color: '#a78bfa', fontWeight: 600 }}>Generating reasoning…</p>
              </div>
            ) : (
              <div className="card-secondary">
                <p className="section-title">💡 Try an example prompt</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {examplePrompts.map((ex, i) => (
                    <button key={i} className="example-pill" onClick={() => setPrompt(ex.text)}>
                      {ex.icon} {ex.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="workspace-container">
            <div className="sidebar">
              <PromptInput
                onGenerate={handleGenerateReasoning}
                loading={loading}
                prompt={prompt}
                setPrompt={setPrompt}
              />

              {error && (
                <div className="error-banner">
                  {error}
                </div>
              )}

              <div className="card" style={{ padding: '20px' }}>
                <p className="section-title">🌿 Branches</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                  {branches.map((branch, index) => (
                    <button
                      key={branch.id}
                      className={`branch-btn ${activeBranchId === branch.id ? 'active' : ''}`}
                      onClick={() => setActiveBranchId(branch.id)}
                    >
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: branch.color, flexShrink: 0, display: 'inline-block', boxShadow: '0 0 10px ' + branch.color }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {index === 0 ? 'Original Reasoning' : `Branch ${index}`}
                      </span>
                    </button>
                  ))}
                </div>
                {branches.length >= 2 && (
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => setShowCompare(!showCompare)}
                  >
                    {showCompare ? 'Hide Compare' : '⚖️ Compare Branches'}
                  </button>
                )}
              </div>
            </div>

            <div className="main-content-layout">
              <div className="canvas-area">
                {loading && (
                  <div className="card" style={{ padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
                    <div className="spinner" />
                    <p style={{ marginTop: '20px', color: '#a78bfa', fontWeight: 600 }}>Updating reasoning tree…</p>
                  </div>
                )}
                {activeBranch && (
                  <>
                    <ReasoningTree
                      branch={activeBranch}
                      selectedNode={selectedNode}
                      onSelectNode={setSelectedNode}
                    />
                    {selectedNode && (
                      <NodeEditor
                        step={selectedNode}
                        onSave={handleFork}
                        onClose={() => setSelectedNode(null)}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="suggestions-panel">
                <div className="suggestions-header">
                  <h3 className="suggestions-title">✨ AI Next-Step Suggestions</h3>
                  <p className="suggestions-subtitle">Select an option to automatically add it to the reasoning path.</p>
                </div>

                {loadingSuggestions ? (
                  <div className="suggestions-loading">
                    <div className="spinner-sm" />
                    <span>Analyzing path and preparing next steps...</span>
                  </div>
                ) : (
                  <div className="suggestions-list">
                    {suggestions.map((sug, i) => (
                      <div key={i} className="suggestion-card" onClick={() => handleAddSuggestion(sug)}>
                        <p className="suggestion-text">{sug}</p>
                        <span className="add-badge">+ Add Step</span>
                      </div>
                    ))}
                    {suggestions.length === 0 && (
                      <p className="no-suggestions">No suggestions available. The path may already be concluded.</p>
                    )}
                  </div>
                )}

                <div className="finish-action-area">
                  <button
                    className="btn-finish"
                    onClick={handleFinishReasoning}
                    disabled={loadingFinal || (activeBranch && activeBranch.steps.some(s => s.isConclusion))}
                  >
                    {loadingFinal ? (
                      <>
                        <div className="spinner-sm" style={{ marginRight: '8px', borderLeftColor: '#fff' }} />
                        Synthesizing...
                      </>
                    ) : (activeBranch && activeBranch.steps.some(s => s.isConclusion)) ? (
                      '🎯 Path Concluded'
                    ) : (
                      '🎯 Finish & Generate Output'
                    )}
                  </button>
                </div>

                {finalConclusion && (
                  <div className="final-conclusion-card">
                    <h4 className="final-title">🎯 Final Synthesized Output</h4>
                    <p className="final-text">{finalConclusion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showCompare && (
        <BranchCompare
          branches={branches}
          selectedBranches={compareBranches}
          onSelectionChange={setCompareBranches}
          onCompare={handleCompare}
          comparison={comparison}
          onClose={() => { setShowCompare(false); setComparison(null); }}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
