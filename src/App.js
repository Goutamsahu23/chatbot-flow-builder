import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';

import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import TextNode from './nodes/TextNode';
import 'reactflow/dist/style.css';


const nodeTypes = { textNode: TextNode };

let idCounter = 1;
const getId = () => `node_${idCounter++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const reactFlowInstanceRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [errorToast, setErrorToast] = useState(null);
  const [saveError, setSaveError] = useState(false);

  // load from localStorage if present (keeps your persistence)
  useEffect(() => {
    const savedFlow = localStorage.getItem('chatbotFlow');
    if (savedFlow) {
      try {
        const parsed = JSON.parse(savedFlow);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
        console.log('Flow restored from localStorage');
      } catch (err) {
        console.error('Failed to parse saved flow', err);
      }
    }
  }, [setNodes, setEdges]);

  // ---------------- Drag & Drop ----------------
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const parsed = JSON.parse(data);

      // compute position relative to wrapper 
      const position = {
        x: event.clientX - reactFlowBounds.left - 110,
        y: event.clientY - reactFlowBounds.top - 30
      };

      const newNode = {
        id: getId(),
        type: parsed.type,
        position,
        data: { text: '', label: parsed.label }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // ---------------- Node selection / update ----------------
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const updateNode = (updatedNode) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // keep node positions stable when user drags them
  const onNodeDragStop = useCallback((_, node) => {
    setNodes((nds) => nds.map((n) => (n.id === node.id ? node : n)));
  }, [setNodes]);

  // count incoming edges for a node
  const incomingForNode = (nodeId) => edges.filter((e) => e.target === nodeId).length;

  // ---------------- Connection validation ----------------
  const onConnect = useCallback(
    (params) => {
      const outgoingExists = edges.some(
        (e) => e.source === params.source && e.sourceHandle === params.sourceHandle
      );

      if (outgoingExists) {
        setErrorToast('Each source handle can only have one outgoing connection.');
        setTimeout(() => setErrorToast(null), 2800);
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  // ---------------- Helper: download ----------------
  function downloadFlow(data) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-flow.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  // ---------------- Save (validate + ask to download) ----------------
  const onSave = () => {
    const totalNodes = nodes.length;

    if (totalNodes <= 1) {
      setSaveError(false);
      const shouldDownload = window.confirm('Flow saved successfully! Do you want to download it?');
      if (shouldDownload) downloadFlow({ nodes, edges });
      localStorage.setItem('chatbotFlow', JSON.stringify({ nodes, edges }));
      return;
    }

    const nodesWithEmptyTarget = nodes.filter((n) => incomingForNode(n.id) === 0).length;

    if (nodesWithEmptyTarget > 1) {
      setSaveError(true);
      setErrorToast('Cannot save: more than one node has empty target handles.');
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    setSaveError(false);
    // persist to localStorage
    localStorage.setItem('chatbotFlow', JSON.stringify({ nodes, edges }));

    const shouldDownload = window.confirm('Flow saved successfully! Do you want to download it?');
    if (shouldDownload) downloadFlow({ nodes, edges });
  };

  const onPaneClick = () => setSelectedNodeId(null);
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  const minZoom = 0.2;
  const maxZoom = 1.7;

  const onInit = useCallback((rfInstance) => {
    const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
    try {
      rfInstance.setViewport(defaultViewport);
    } catch (err) {
      try {
        rfInstance.setTransform(defaultViewport);
      } catch (_) { }
    }
  }, []);


  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <ReactFlowProvider>
      <div className="app">
        <div className="topbar">
          {errorToast && <div className="error-banner">{errorToast}</div>}
          <button className={`save-btn ${saveError ? 'error' : ''}`} onClick={onSave}>
            Save Changes
          </button>
        </div>

        <div className="main-content">
          <div className="canvas-area" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={onInit}
              defaultViewport={defaultViewport}
              minZoom={minZoom}
              maxZoom={maxZoom}
              onNodeDragStop={onNodeDragStop}
              style={{ width: '100%', height: '100%' }}
            >
              <Background gap={16} />
              <Controls />
            </ReactFlow>
          </div>

          <div className="right-panel">
            {selectedNode ? (
              <SettingsPanel node={selectedNode} updateNode={updateNode} onClose={() => setSelectedNodeId(null)} />
            ) : (
              <NodesPanel />
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
