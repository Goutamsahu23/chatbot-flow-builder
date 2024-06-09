import React, { useState } from 'react';

const SettingsPanel = ({ node, setNodes }) => {
  const [inputValue, setInputValue] = useState(node ? node.data.text : '');

  if (!node) {
    return <div className="settings-panel">Select a node to see its settings</div>;
  }

  const onChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          n.data = { ...n.data, text: value };
        }
        return n;
      })
    );
  };

  const onBlur = () => {
    if (inputValue.trim() === '') {
      setInputValue(''); // Clear input value
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            n.data = { ...n.data, text: '' };
          }
          return n;
        })
      );
    }
  };

  return (
    <div className="settings-panel">
      <div>
        <label>Text</label>
        <input type="text" value={inputValue} onChange={onChange} onBlur={onBlur} />
      </div>
    </div>
  );
};

export default SettingsPanel;
