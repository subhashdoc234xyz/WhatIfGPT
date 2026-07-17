import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

function ReasoningTree({ branch, selectedNode, onSelectNode }) {
  const nodesAndEdges = useMemo(() => {
    if (!branch || !branch.steps) return { nodes: [], edges: [] };

    const nodes = branch.steps.map((step, index) => {
      const isSelected = selectedNode?.id === step.id;
      
      return {
        id: step.id.toString(),
        position: { x: 50, y: index * 180 },
        data: {
          label: (
            <div 
              className="p-4 rounded-lg glass-card cursor-pointer transition-all hover:scale-105"
              style={{
                borderLeft: `4px solid ${branch.color}`,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : undefined,
              }}
              onClick={() => onSelectNode(step)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm opacity-70">
                  {step.isConclusion ? '🎯 Conclusion' : `Step ${step.id}`}
                </span>
                {!step.isConclusion && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    ✏️ Click to edit
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                {step.stepText}
              </p>
            </div>
          ),
        },
        style: {
          background: 'transparent',
          border: 'none',
          width: 350,
        },
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
        style: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'rgba(255, 255, 255, 0.5)',
        },
      }));

    return { nodes, edges };
  }, [branch, selectedNode, onSelectNode]);

  if (!branch || !branch.steps || branch.steps.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel h-[700px] w-full">
      <ReactFlow
        nodes={nodesAndEdges.nodes}
        edges={nodesAndEdges.edges}
        fitView
        attributionPosition="bottom-right"
        defaultZoom={0.8}
        minZoom={0.2}
        maxZoom={2}
        panOnDrag={true}
        zoomOnScroll={true}
        selectNodesOnDrag={false}
      >
        <Background color="rgba(255, 255, 255, 0.1)" gap={20} size={1} />
        <Controls 
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
        />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card p-3 text-sm">
        <h4 className="font-semibold mb-2">How to use:</h4>
        <ul className="space-y-1 text-xs text-white/80">
          <li>• Click any step to edit it</li>
          <li>• Edit & save to create a new branch</li>
          <li>• Compare branches to see differences</li>
          <li>• Pan and zoom to explore the tree</li>
        </ul>
      </div>
    </div>
  );
}

export default ReasoningTree;
