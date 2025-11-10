

# Chatbot Flow Builder

[Live Demo](https://chatbot-flow-builder-g.vercel.app/)

An interactive visual editor for building chatbot conversation flows using drag-and-drop nodes. Built with React and React Flow.

## Features

- Drag and drop nodes to design chatbot flows
- Connect nodes visually to define conversation paths
- Save and download your flow as JSON
- Restore previous flows from local storage
- Custom node types (easily extensible)

## Installation

Clone the repository:

```powershell
git clone https://github.com/Goutamsahu23/chatbot-flow-builder.git
cd chatbot-flow-builder
```

Install dependencies:

```powershell
npm install
```

## Running the App

Start the development server:

```powershell
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Drag a node from the Nodes Panel (right side) onto the canvas.
2. Connect nodes by dragging from one node's handle to another.
3. Click a node to edit its settings.
4. Save your flow and optionally download it as a JSON file.

## Project Structure

- `src/` — Main source code
	- `components/` — UI panels
	- `nodes/` — Custom node types
	- `App.js` — Main app logic

## Build for Production

```powershell
npm run build
```

## License

MIT
