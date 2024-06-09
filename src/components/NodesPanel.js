import React from 'react';
import { useDrag } from 'react-dnd';

const ItemType = {
  NODE: 'node',
};

const NodesPanel = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.NODE,
    item: { type: 'textNode' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className="nodes-panel">
      <div className="node" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="node-label">Message</div>
      </div>
    </div>
  );
};

export default NodesPanel;
