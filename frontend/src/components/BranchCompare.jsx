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
    <div className="modal-backdrop">
      <div className="card" style={{ maxWidth: '800px', width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #C4B5FD', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E1B2E' }}>
            ⚖️ Compare Branches
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.8rem', color: '#6B7280', lineHeight: 1, opacity: 0.8, padding: '4px' }}
          >
            ×
          </button>
        </div>

        {/* Branch Selection */}
        <div style={{ marginBottom: '24px' }}>
          <p className="section-title">Select two branches to compare:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {branches.map((branch, index) => {
              const isSelected = selectedBranches.includes(branch.id);
              return (
                <button
                  key={branch.id}
                  onClick={() => handleBranchToggle(branch.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #8b5cf6' : '1px solid #E9E5FF',
                    backgroundColor: isSelected ? '#F5F3FF' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.08)' : 'none',
                  }}
                  disabled={!isSelected && selectedBranches.length >= 2}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: branch.color,
                        border: '1px solid #ffffff',
                        boxShadow: `0 0 6px ${branch.color}`
                      }}
                    />
                    <span style={{ fontWeight: 700, color: '#1E1B2E', fontSize: '0.9rem' }}>
                      {index === 0 ? 'Original' : `Branch ${index}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
                    {branch.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compare Button */}
        {selectedBranches.length === 2 && !comparison && (
          <button
            onClick={onCompare}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginBottom: '24px' }}
          >
            {loading ? 'Comparing...' : '🔄 Compare Selected Branches'}
          </button>
        )}

        {/* Comparison Results */}
        {comparison && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontWeight: 800, color: '#1E1B2E', fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✨</span> Comparison Analysis
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#1E1B2E', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontWeight: 500 }}>
                {comparison}
              </div>
            </div>

            {/* Side-by-side conclusions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {selectedBranches.map(branchId => {
                const branch = branches.find(b => b.id === branchId);
                const index = branches.findIndex(b => b.id === branchId);
                return (
                  <div key={branchId} style={{ backgroundColor: '#ffffff', border: '1px solid #E9E5FF', borderRadius: '12px', padding: '16px' }}>
                    <h5 style={{ fontWeight: 700, color: '#1E1B2E', fontSize: '0.88rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div 
                        style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: branch.color }} 
                      />
                      {index === 0 ? 'Original' : `Branch ${index}`}
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
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
          className="btn-secondary"
          style={{ width: '100%', padding: '14px' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BranchCompare;
