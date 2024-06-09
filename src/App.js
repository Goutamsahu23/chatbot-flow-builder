import React, { useState } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import SaveButton from './components/SaveButton';
import TextNode from './nodes/TextNode';
import './App.css';

const nodeTypes = {
  textNode: TextNode,
};

const FlowContainer = ({ setNodes, nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'node',
    drop: (item, monitor) => {
      const reactFlowBounds = document.querySelector('.reactflow-wrapper').getBoundingClientRect();
      const position = monitor.getClientOffset();
      const newNode = {
        id: String(new Date().getTime()),
        type: item.type,
        position: {
          x: position.x - reactFlowBounds.left,
          y: position.y - reactFlowBounds.top,
        },
        data: { text: 'New Node' },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [setNodes]);

  return (
    <div ref={drop} className="flow-container">
      <div className="reactflow-wrapper" style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {isOver && <div className="drop-overlay">Drop here</div>}
    </div>
  );
};

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const onNodeClick = (event, node) => setSelectedNode(node);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="navbar">
          <SaveButton nodes={nodes} edges={edges} />
        </div>
        <div className='content'>
        <NodesPanel />
        <FlowContainer
          setNodes={setNodes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        />
        <SettingsPanel node={selectedNode} setNodes={setNodes} />
      </div>
      </div>
    </DndProvider>
  );
};

export default App;
