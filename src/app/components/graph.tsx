"use client"

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { Tree, Branch } from '@/lib/types';

interface GraphProps {
  tree: Tree;
}

interface FlowNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
  type?: string;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export default function Graph({ tree }: GraphProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);

  useEffect(() => {
    const { flowNodes, flowEdges } = convertTreeToFlow(tree);
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [tree]);

  const convertTreeToFlow = (treeData: Tree): { flowNodes: FlowNode[]; flowEdges: FlowEdge[] } => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: FlowEdge[] = [];
    let nodeIdCounter = 0;
    let yOffset = 0;

    // Add root node (tree title)
    const rootNodeId = `node-${nodeIdCounter++}`;
    flowNodes.push({
      id: rootNodeId,
      position: { x: 400, y: yOffset },
      data: { label: treeData.title },
      type: 'default'
    });
    yOffset += 100;

    // Convert branches to nodes
    const processBranches = (branches: Branch[], parentId: string, level: number = 0) => {
      const levelWidth = 300;
      const levelSpacing = 150;
      const startX = 400 - (branches.length - 1) * levelWidth / 2;

      branches.forEach((branch, index) => {
        const nodeId = `node-${nodeIdCounter++}`;
        const x = startX + index * levelWidth;
        const y = yOffset + level * levelSpacing;

        flowNodes.push({
          id: nodeId,
          position: { x, y },
          data: { label: branch.text },
          type: 'default'
        });

        // Add edge from parent to this node
        flowEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId
        });

        // Process child branches
        if (branch.branches && branch.branches.length > 0) {
          processBranches(branch.branches, nodeId, level + 1);
        }
      });

      // Update y offset for next level
      if (level === 0) {
        yOffset += levelSpacing;
      }
    };

    if (treeData.branches && treeData.branches.length > 0) {
      processBranches(treeData.branches, rootNodeId);
    }

    return { flowNodes, flowEdges };
  };

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="w-full h-full">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">{tree.title}</h2>
        {tree.description && (
          <p className="text-sm text-gray-600">{tree.description}</p>
        )}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-gray-50"
      />
    </div>
  );
}
