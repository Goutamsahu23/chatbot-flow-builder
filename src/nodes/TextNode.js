import React from 'react';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { Handle } from 'reactflow';

/**
 * TextNode - custom node component for a text/message node.
 * - target handle (left) can accept multiple incoming edges
 * - source handle (right) should allow only one outgoing connection (we enforce in onConnect)
 *
 * Props from React Flow: { id, data }
 * data.text holds the node text
 */
const nodeContainerStyle = {
  width: 220,
  padding: 8,
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0 10px 25px rgba(2,6,23,0.06)',
  border: '1px solid rgba(0,0,0,0.03)'
};

export default function TextNode({ id, data }) {
  const text = data?.text || '';

  return (
    <div className="rf-node-custom-card" style={nodeContainerStyle}>
      {/* incoming handle (target) on left */}
      <Handle type="target" position="left" id="t" style={{ background: '#111', left: -8 }} />

      <div className="rf-node-title">
        <BiMessageRoundedDetail size={15}/>
        Send Message</div>
      <div className="rf-node-text">
        {text ? <span>{text}</span> : <span style={{ color: '#9ca3af' }}>empty</span>}
      </div>

      {/* outgoing handle (source) on right */}
      <Handle type="source" position="right" id="s" style={{ background: '#111', right: -8 }} />
    </div>
  );
}
