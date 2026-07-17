import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

function ReasoningTree({ branch, selectedNode, onSelectNode, onViewConclusion }) {
  const { nodes, edges } = useMemo(() => {
    if (!branch || !branch.steps) return { nodes: [], edges: [] };

    const nodes = branch.steps.map((step, index) => {
      const isSelected = selectedNode?.id === step.id;
      const isConclusion = step.isConclusion;

      return {
        id: step.id.toString(),
        position: { x: 60, y: index * 190 },
        data: {
          label: (
            <div
              onClick={() => onSelectNode(step)}
              style={{
                background: isSelected ? '#F5F3FF' : '#ffffff',
                border: isSelected 
                  ? `2px solid ${branch.color}` 
                  : isConclusion 
                    ? `2.5px solid ${branch.color}` 
                    : '1px solid #E9E5FF',
                borderLeft: `5px solid ${branch.color}`,
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected
                  ? `0 4px 20px rgba(139, 92, 246, 0.15)`
                  : '0 4px 20px rgba(139, 92, 246, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: branch.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}>
                  {isConclusion ? '🎯 Conclusion' : `Step ${step.id}`}
                </span>
                {isConclusion ? (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#8b5cf6',
                    background: '#F3F0FF',
                    border: '1px solid #C4B5FD',
                    borderRadius: '6px',
                    padding: '2px 6px',
                  }}>
                    FINAL ANSWER
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#8b5cf6',
                    background: '#FAF9FF',
                    border: '1px solid #E9E5FF',
                    borderRadius: '20px',
                    padding: '2px 8px',
                  }}>
                    ✏️ Edit
                  </span>
                )}
              </div>
              {isConclusion ? (
                <div style={{ marginTop: '10px', textAlign: 'left' }}>
                  <p style={{
                    fontSize: '0.78rem',
                    color: '#6B7280',
                    lineHeight: 1.4,
                    marginBottom: '10px',
                    fontStyle: 'italic'
                  }}>
                    Synthesized output generated successfully.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewConclusion(step.stepText);
                    }}
                    style={{
                      background: branch.color,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
                    }}
                  >
                    📄 Open Final Output
                  </button>
                </div>
              ) : (
                <p style={{
                  fontSize: '0.82rem',
                  color: '#1E1B2E',
                  lineHeight: 1.55,
                  fontWeight: 500,
                  whiteSpace: 'pre-wrap',
                }}>
                  {step.stepText}
                </p>
              )}
            </div>
          ),
        },
        style: { background: 'transparent', border: 'none', width: 360 },
      };
    });

    const edges = branch.steps
      .filter(step => step.dependsOn !== null)
      .map(step => ({
        id: `edge-${step.dependsOn}-${step.id}`,
        source: step.dependsOn.toString(),
        target: step.id.toString(),
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#C4B5FD', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#C4B5FD' },
      }));

    return { nodes, edges };
  }, [branch, selectedNode, onSelectNode]);

  if (!branch?.steps?.length) return null;

  return (
    <div className="card" style={{ height: '680px', position: 'relative', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        defaultViewport={{ zoom: 0.8, x: 0, y: 0 }}
        minZoom={0.2}
        maxZoom={2}
        panOnDrag
        zoomOnScroll={false}
        panOnScroll={true}
        selectNodesOnDrag={false}
        attributionPosition="bottom-right"
      >
        <Background color="rgba(139,92,246,0.06)" gap={24} size={1} />
        <Controls />
      </ReactFlow>

      {/* Legend */}
      <div className="card-sm" style={{ position: 'absolute', bottom: 16, left: 16, padding: '12px 16px', zIndex: 5 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          How to use
        </p>
        <ul style={{ fontSize: '0.75rem', color: '#5b21b6', fontWeight: 500, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>• Click any step to edit it</li>
          <li>• Save edit to create a branch</li>
          <li>• Pan & zoom to explore</li>
        </ul>
      </div>
    </div>
  );
}

export default ReasoningTree;
