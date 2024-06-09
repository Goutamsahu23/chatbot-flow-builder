import React from 'react';
import { Handle } from 'reactflow';

const TextNode = ({ data }) => {
  return (
    <div className="text-node">
      <div className="node-header">Send Message</div>
      <div className="node-body">
        <div>{data.text}</div>
      </div>
      <Handle type="source" position="right" id="a" className="source-handle" />
      <Handle type="target" position="left" id="b" className="target-handle" />
    </div>
  );
};

export default TextNode;
