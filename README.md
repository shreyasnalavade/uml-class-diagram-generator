# UML Class Diagram Generator

A responsive React application for building UML class diagrams and generating Java source from them. The diagram editor uses React Flow.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Use the editor

- Add classes with **+ Add Class**. Select a class to edit its name, attributes, methods, and method parameters.
- Drag classes to arrange them. Start a connection from a class handle to another class to create a relationship using the currently selected relationship tool.
- Select an edge and choose **Delete Relationship** to remove it. Select a class and choose **Delete Class** to remove it and its connected relationships.
- Choose **Generate Java** to create Java classes. Inheritance becomes `extends`; association, aggregation, and composition become typed fields; dependency is emitted as a source comment.
- The generated source panel includes a copy button. **Clear** removes the current diagram.

Visibility uses standard UML symbols: `+` public, `-` private, and `#` protected.

## Project structure

- `src/App.jsx` — diagram state and editor interactions
- `src/components/ClassNode.jsx` — UML class rendering
- `src/components/UMLEdge.jsx` — relationship rendering
- `src/JavaCodeGenerator.js` — Java source generation
- `src/App.css` — application styling and responsive layout
