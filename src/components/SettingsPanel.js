import React from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";

//  SettingsPanel
//          -Appears when a node is selected
//          -Lets you edit the message text

export default function SettingsPanel({ node, updateNode, onClose }) {
    if (!node) {
        return (
            <div>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Nodes Panel</div>
                <div className="small-note">Select a node to edit its settings</div>
            </div>
        );
    }

    const onChangeText = (e) => {
        const newText = e.target.value;
        const updated = { ...node, data: { ...node.data, text: newText } };
        updateNode(updated);
    };

    return (
        <div>
            {/* Header Section */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                        color: '#374151',
                        padding: 0,
                    }}
                    aria-label="Back to Nodes Panel"
                    title="Back"
                >
                    <IoIosArrowRoundBack size={30} />
                </button>

                {/* Heading Text */}
                <div className="settings-title">Message</div>
            </div>

            {/* Text Area */}
            <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Text</div>
                <textarea
                    className="textarea"
                    value={node.data?.text || ''}
                    onChange={onChangeText}
                    placeholder="Enter text for this message node..."
                />
            </div>
        </div>
    );
}
