"use client"

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import { Tree, Branch } from '@/lib/types';
import Dagre from '@dagrejs/dagre';

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

const getLayoutedElements = (nodes: FlowNode[], edges: FlowEdge[]) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: 200,
      height: 50,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - 200 / 2;
      const y = position.y - 50 / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function LayoutFlow({ tree }: { tree: Tree }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  const convertTreeToFlow = useCallback((treeData: Tree): { flowNodes: FlowNode[]; flowEdges: FlowEdge[] } => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: FlowEdge[] = [];
    let nodeIdCounter = 0;

    // Add root node (tree title)
    const rootNodeId = `node-${nodeIdCounter++}`;
    flowNodes.push({
      id: rootNodeId,
      position: { x: 0, y: 0 }, // Will be positioned by Dagre
      data: { label: treeData.title },
      type: 'default'
    });

    // Convert branches to nodes
    const processBranches = (branches: Branch[], parentId: string) => {
      branches.forEach((branch) => {
        const nodeId = `node-${nodeIdCounter++}`;

        flowNodes.push({
          id: nodeId,
          position: { x: 0, y: 0 }, // Will be positioned by Dagre
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
          processBranches(branch.branches, nodeId);
        }
      });
    };

    if (treeData.branches && treeData.branches.length > 0) {
      processBranches(treeData.branches, rootNodeId);
    }

    return { flowNodes, flowEdges };
  }, []);

  useEffect(() => {
    const { flowNodes, flowEdges } = convertTreeToFlow(tree);
    const layouted = getLayoutedElements(flowNodes, flowEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [tree, convertTreeToFlow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges],
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

export default function Graph({ tree }: GraphProps) {
  return (
    <ReactFlowProvider>
      <LayoutFlow tree={tree} />
    </ReactFlowProvider>
  );
}
