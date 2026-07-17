import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'react-flow-renderer';
import PromptInput from './components/PromptInput';
import ReasoningTree from './components/ReasoningTree';
import NodeEditor from './components/NodeEditor';
import BranchCompare from './components/BranchCompare';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

  const handleGenerateReasoning = async (userPrompt) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reasoning');
      }

      const data = await response.json();
      
      const newBranch = {
        id: Date.now(),
        prompt: userPrompt,
        steps: data.steps,
        conclusion: data.conclusion,
        parentId: null,
        editedStepId: null,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
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
      
      // Update the edited step
      stepsBeforeEdit[stepIndex] = editedStep;

      const response = await fetch(`${API_URL}/api/fork`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: activeBranch.prompt,
          edited_step: editedStep,
          steps_before_edit: stepsBeforeEdit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fork reasoning');
      }

      const data = await response.json();
      
      const newBranch = {
        id: Date.now(),
        prompt: activeBranch.prompt,
        steps: data.steps,
        conclusion: data.conclusion,
        parentId: activeBranchId,
        editedStepId: editedStep.id,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch1_steps: branch1.steps,
          branch1_conclusion: branch1.conclusion,
          branch2_steps: branch2.steps,
          branch2_conclusion: branch2.conclusion,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare branches');
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeBranch = branches.find(b => b.id === activeBranchId);

  return (
    <div className="min-h-screen text-white p-4">
      {/* Header */}
      <header className="glass-card mb-6 p-6">
        <h1 className="text-4xl font-bold mb-2 text-center">
          ✨ WhatIfGPT
        </h1>
        <p className="text-center text-white/80 text-lg">
          Don't just read reasoning — fork it, edit it, and watch the answer change.
        </p>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Prompt & Branches */}
        <div className="lg:col-span-1 space-y-4">
          <PromptInput 
            onGenerate={handleGenerateReasoning} 
            loading={loading}
          />

          {/* Branch List */}
          {branches.length > 0 && (
            <div className="glass-panel p-4">
              <h3 className="text-xl font-semibold mb-3">Branches</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {branches.map((branch, index) => (
                  <button
                    key={branch.id}
                    onClick={() => setActiveBranchId(branch.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeBranchId === branch.id
                        ? 'bg-white/30 border-white/40'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    } border`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="font-medium">
                        {index === 0 ? 'Original' : `Branch ${index}`}
                      </span>
                    </div>
                    {branch.editedStepId && (
                      <p className="text-xs text-white/60 mt-1">
                        Forked at step {branch.editedStepId}
                      </p>
                    )}
                  </button>
                ))}
              </div>

              {/* Compare Button */}
              {branches.length >= 2 && (
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className="glass-button w-full mt-4 py-2"
                >
                  {showCompare ? 'Hide Compare' : 'Compare Branches'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center - Reasoning Tree */}
        <div className="lg:col-span-3">
          {error && (
            <div className="glass-card p-4 mb-4 bg-red-500/30 border-red-400">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {loading && !activeBranch && (
            <div className="glass-panel p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-lg">Generating reasoning...</p>
            </div>
          )}

          {!activeBranch && !loading && (
            <div className="glass-panel p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Exploring</h2>
              <p className="text-white/70 mb-6">
                Enter a question or problem to see AI reasoning broken down into interactive steps.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="glass-card p-4">
                  <h3 className="font-semibold mb-2">💡 Example Prompts:</h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Should I launch this product in Q1 or Q2?</li>
                    <li>• Is it better to rent or buy a home?</li>
                    <li>• Should I accept this job offer?</li>
                    <li>• What's the best approach to learn programming?</li>
                  </ul>
                </div>
              </div>
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
      </div>

      {/* Branch Comparison Modal */}
      {showCompare && (
        <BranchCompare
          branches={branches}
          selectedBranches={compareBranches}
          onSelectionChange={setCompareBranches}
          onCompare={handleCompare}
          comparison={comparison}
          onClose={() => {
            setShowCompare(false);
            setComparison(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
