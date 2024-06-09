import React from 'react';

const SaveButton = ({ nodes, edges }) => {
  const onSave = () => {
    const nodesWithNoTarget = nodes.filter(
      (node) => !edges.some((edge) => edge.source === node.id)
    );

    if (nodes.length > 1 && nodesWithNoTarget.length > 1) {
      alert('Error: More than one node with empty target handles');
    } else {
      const flowData = { nodes, edges };
      console.log('Flow Data:', flowData);
      alert('Flow saved successfully');
    }
  };

  return (
    <button onClick={onSave} className="save-button">
      Save Changes
    </button>
  );
};

export default SaveButton;
