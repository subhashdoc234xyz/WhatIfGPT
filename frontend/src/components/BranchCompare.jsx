import React from 'react';

function BranchCompare({ 
  branches, 
  selectedBranches, 
  onSelectionChange, 
  onCompare, 
  comparison, 
  onClose,
  loading 
}) {
  const handleBranchToggle = (branchId) => {
    if (selectedBranches.includes(branchId)) {
      onSelectionChange(selectedBranches.filter(id => id !== branchId));
    } else if (selectedBranches.length < 2) {
      onSelectionChange([...selectedBranches, branchId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-bold">🔍 Compare Branches</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Branch Selection */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Select two branches to compare:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {branches.map((branch, index) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchToggle(branch.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    selectedBranches.includes(branch.id)
                      ? 'bg-white/30 border-white/40'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                  disabled={
                    !selectedBranches.includes(branch.id) && 
                    selectedBranches.length >= 2
                  }
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: branch.color }}
                    />
                    <span className="font-medium">
                      {index === 0 ? 'Original' : `Branch ${index}`}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-2 line-clamp-2">
                    {branch.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Compare Button */}
          {selectedBranches.length === 2 && !comparison && (
            <button
              onClick={onCompare}
              disabled={loading}
              className="glass-button w-full py-3 mb-6 disabled:opacity-50"
            >
              {loading ? 'Comparing...' : '🔄 Compare Selected Branches'}
            </button>
          )}

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-6">
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✅ Comparison Complete</h4>
                <div className="text-sm text-white/80 whitespace-pre-wrap">
                  {comparison}
                </div>
              </div>

              {/* Side-by-side conclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBranches.map(branchId => {
                  const branch = branches.find(b => b.id === branchId);
                  const index = branches.findIndex(b => b.id === branchId);
                  return (
                    <div key={branchId} className="glass-card p-4">
                      <h5 className="font-semibold mb-2 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: branch.color }}
                        />
                        {index === 0 ? 'Original' : `Branch ${index}`}
                      </h5>
                      <p className="text-sm text-white/80">
                        {branch.conclusion}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="glass-button w-full mt-6 py-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BranchCompare;
