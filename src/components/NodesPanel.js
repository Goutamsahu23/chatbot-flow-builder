import React from 'react';
import { BiMessageRoundedDetail } from "react-icons/bi";

//   NodesPanel - right side panel when no node is selected.
//   Extensible: add more items to nodeItems for new node types.

export default function NodesPanel() {
    // Add more types here in future 
    const nodeItems = [
        { id: 'msg', label: 'Message', type: 'textNode' },
        // { id: 'img', label: 'Image', type: 'imageNode' }
    ];

    function onDragStart(event, item) {
        // store node meta for onDrop handler in App
        event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
        event.dataTransfer.effectAllowed = 'move';
    }

    return (
        <div>
            {/* <div style={{ fontWeight: 700, marginBottom: 12 }}>Nodes Panel</div> */}

            {nodeItems.map((it) => (
                <div
                    key={it.id}
                    className="node-item"
                    draggable
                    onDragStart={(e) => onDragStart(e, it)}
                    title="Drag to canvas"
                >
                    <div className="node-emoji">
                        <BiMessageRoundedDetail size={30} color='#2673d7'/>
                    </div>
                    <div className="node-label">{it.label}</div>
                </div>
            ))}

            <div className="small-note">Drag & drop a node to the canvas</div>
        </div>
    );
}
