import { useCallback, useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

import ClassNode from "./components/ClassNode";
import UMLEdge from "./components/UMLEdge";
import generateJavaCode from "./JavaCodeGenerator";

const nodeTypes = {
  umlClass: ClassNode,
};

const edgeTypes = {
  umlEdge: UMLEdge,
};

function createClassNode(id, name, x, y) {
  return {
    id,
    type: "umlClass",
    position: {
      x,
      y,
    },
    data: {
      name,

      attributes: [
        {
          id: `${id}-attribute-1`,
          name: "name",
          type: "String",
          visibility: "-",
        },
        {
          id: `${id}-attribute-2`,
          name: "rollNo",
          type: "int",
          visibility: "-",
        },
      ],

      methods: [
        {
          id: `${id}-method-1`,
          name: "getName",
          returnType: "String",
          visibility: "+",
          parameters: [],
        },
        {
          id: `${id}-method-2`,
          name: "getRollNo",
          returnType: "int",
          visibility: "+",
          parameters: [],
        },
      ],
    },
  };
}

function App() {
  const initialNodes = [
    createClassNode(
      "student",
      "Student",
      250,
      150
    ),
  ];

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState([]);

  const [selectedNode, setSelectedNode] =
    useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const [relationshipType, setRelationshipType] =
    useState("association");

  const [generatedCode, setGeneratedCode] =
    useState("");

  // -------------------------
  // RELATIONSHIPS
  // -------------------------

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: "umlEdge",
        data: {
          relationshipType,
        },
      };

      setEdges((currentEdges) =>
        addEdge(edge, currentEdges)
      );
    },
    [relationshipType, setEdges]
  );

  // -------------------------
  // CLASS MANAGEMENT
  // -------------------------

  const addClass = () => {
    const classNumber =
      nodes.filter((node) =>
        node.id.startsWith("class-")
      ).length + 1;

    const newNode = createClassNode(
      `class-${classNumber}`,
      `Class${classNumber}`,
      100 + classNumber * 60,
      100 + classNumber * 60
    );

    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setGeneratedCode("");
  };

  const selectNode = (_, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const selectEdge = (_, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  const deleteSelectedClass = () => {
    if (!selectedNode) {
      return;
    }

    const nodeId = selectedNode.id;

    // Delete the class
    setNodes((currentNodes) =>
      currentNodes.filter(
        (node) => node.id !== nodeId
      )
    );

    // Delete all relationships connected to it
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId
      )
    );

    setSelectedNode(null);
  };

  const deleteSelectedRelationship = () => {
    if (!selectedEdge) return;
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== selectedEdge.id));
    setSelectedEdge(null);
  };

  // -------------------------
  // CLASS DATA UPDATE
  // -------------------------

  const updateSelectedClass = (changes) => {
    if (!selectedNode) {
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id !== selectedNode.id) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            ...changes,
          },
        };
      })
    );

    setSelectedNode((currentNode) => ({
      ...currentNode,
      data: {
        ...currentNode.data,
        ...changes,
      },
    }));
  };

  // -------------------------
  // ATTRIBUTES
  // -------------------------

  const updateAttribute = (
    attributeId,
    field,
    value
  ) => {
    if (!selectedNode) {
      return;
    }

    const updatedAttributes =
      selectedNode.data.attributes.map(
        (attribute) =>
          attribute.id === attributeId
            ? {
                ...attribute,
                [field]: value,
              }
            : attribute
      );

    updateSelectedClass({
      attributes: updatedAttributes,
    });
  };

  const addAttribute = () => {
    if (!selectedNode) {
      return;
    }

    const newAttribute = {
      id: `${selectedNode.id}-attribute-${Date.now()}`,
      name: "newAttribute",
      type: "String",
      visibility: "-",
    };

    updateSelectedClass({
      attributes: [
        ...selectedNode.data.attributes,
        newAttribute,
      ],
    });
  };

  const deleteAttribute = (attributeId) => {
    if (!selectedNode) {
      return;
    }

    updateSelectedClass({
      attributes:
        selectedNode.data.attributes.filter(
          (attribute) =>
            attribute.id !== attributeId
        ),
    });
  };

  // -------------------------
  // METHODS
  // -------------------------

  const updateMethod = (
    methodId,
    field,
    value
  ) => {
    if (!selectedNode) {
      return;
    }

    const updatedMethods =
      selectedNode.data.methods.map(
        (method) =>
          method.id === methodId
            ? {
                ...method,
                [field]: value,
              }
            : method
      );

    updateSelectedClass({
      methods: updatedMethods,
    });
  };

  const addMethod = () => {
    if (!selectedNode) {
      return;
    }

    const newMethod = {
      id: `${selectedNode.id}-method-${Date.now()}`,
      name: "newMethod",
      returnType: "void",
      visibility: "+",
      parameters: [],
    };

    updateSelectedClass({
      methods: [
        ...selectedNode.data.methods,
        newMethod,
      ],
    });
  };

  const deleteMethod = (methodId) => {
    if (!selectedNode) {
      return;
    }

    updateSelectedClass({
      methods:
        selectedNode.data.methods.filter(
          (method) =>
            method.id !== methodId
        ),
    });
  };

  // -------------------------
  // PARAMETERS
  // -------------------------

  const updateParameter = (
    methodId,
    parameterId,
    field,
    value
  ) => {
    if (!selectedNode) {
      return;
    }

    const updatedMethods =
      selectedNode.data.methods.map(
        (method) => {
          if (method.id !== methodId) {
            return method;
          }

          const updatedParameters =
            method.parameters.map(
              (parameter) =>
                parameter.id === parameterId
                  ? {
                      ...parameter,
                      [field]: value,
                    }
                  : parameter
            );

          return {
            ...method,
            parameters: updatedParameters,
          };
        }
      );

    updateSelectedClass({
      methods: updatedMethods,
    });
  };

  const addParameter = (methodId) => {
    if (!selectedNode) {
      return;
    }

    const updatedMethods =
      selectedNode.data.methods.map(
        (method) => {
          if (method.id !== methodId) {
            return method;
          }

          const newParameter = {
            id: `${methodId}-parameter-${Date.now()}`,
            name: "parameter",
            type: "String",
          };

          return {
            ...method,
            parameters: [
              ...(method.parameters || []),
              newParameter,
            ],
          };
        }
      );

    updateSelectedClass({
      methods: updatedMethods,
    });
  };

  const deleteParameter = (
    methodId,
    parameterId
  ) => {
    if (!selectedNode) {
      return;
    }

    const updatedMethods =
      selectedNode.data.methods.map(
        (method) => {
          if (method.id !== methodId) {
            return method;
          }

          return {
            ...method,
            parameters:
              method.parameters.filter(
                (parameter) =>
                  parameter.id !== parameterId
              ),
          };
        }
      );

    updateSelectedClass({
      methods: updatedMethods,
    });
  };

  // -------------------------
  // JAVA GENERATION
  // -------------------------

  const generateCode = () => {
    const code = generateJavaCode(
      nodes,
      edges
    );

    setGeneratedCode(code);
  };

  // -------------------------
  // UI
  // -------------------------

  return (
    <div className="app">
      <header className="header">
        <h1>
          UML Class Diagram Generator
        </h1>

        <button
          className="generate-button"
          onClick={generateCode}
        >
          Generate Java
        </button>
      </header>

      <div className="toolbar">
        <button onClick={addClass}>
          + Add Class
        </button>

        <button
          className={
            relationshipType === "association"
              ? "active-tool"
              : ""
          }
          onClick={() =>
            setRelationshipType("association")
          }
        >
          Association
        </button>

        <button
          className={
            relationshipType === "inheritance"
              ? "active-tool"
              : ""
          }
          onClick={() =>
            setRelationshipType("inheritance")
          }
        >
          Inheritance
        </button>

        <button
          className={
            relationshipType === "aggregation"
              ? "active-tool"
              : ""
          }
          onClick={() =>
            setRelationshipType("aggregation")
          }
        >
          Aggregation
        </button>

        <button
          className={
            relationshipType === "composition"
              ? "active-tool"
              : ""
          }
          onClick={() =>
            setRelationshipType("composition")
          }
        >
          Composition
        </button>

        <button
          className={
            relationshipType === "dependency"
              ? "active-tool"
              : ""
          }
          onClick={() =>
            setRelationshipType("dependency")
          }
        >
          Dependency
        </button>

        <button onClick={clearCanvas}>
          Clear
        </button>
        {selectedEdge && (
          <button className="delete-class-button" onClick={deleteSelectedRelationship}>
            Delete Relationship
          </button>
        )}
      </div>

      <div className="editor">
        <main className="workspace">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={selectNode}
            onEdgeClick={selectEdge}
            onPaneClick={() => { setSelectedNode(null); setSelectedEdge(null); }}
            deleteKeyCode={[
              "Backspace",
              "Delete",
            ]}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </main>

        {selectedNode && (
          <aside className="properties-panel">
            <div className="properties-header">
              <h2>
                Class Properties
              </h2>

              <button
                className="delete-class-button"
                onClick={
                  deleteSelectedClass
                }
              >
                Delete Class
              </button>
            </div>

            {/* CLASS NAME */}

            <label>
              Class Name
            </label>

            <input
              value={selectedNode.data.name}
              onChange={(event) =>
                updateSelectedClass({
                  name: event.target.value,
                })
              }
            />

            {/* ATTRIBUTES */}

            <div className="panel-section">
              <div className="section-header">
                <h3>
                  Attributes
                </h3>

                <button onClick={addAttribute}>
                  + Add
                </button>
              </div>

              {selectedNode.data.attributes.map(
                (attribute) => (
                  <div
                    className="property-row"
                    key={attribute.id}
                  >
                    <input
                      value={attribute.name}
                      onChange={(event) =>
                        updateAttribute(
                          attribute.id,
                          "name",
                          event.target.value
                        )
                      }
                    />

                    <input
                      value={attribute.type}
                      onChange={(event) =>
                        updateAttribute(
                          attribute.id,
                          "type",
                          event.target.value
                        )
                      }
                    />

                    <select
                      value={
                        attribute.visibility
                      }
                      onChange={(event) =>
                        updateAttribute(
                          attribute.id,
                          "visibility",
                          event.target.value
                        )
                      }
                    >
                      <option value="+">
                        +
                      </option>

                      <option value="-">
                        -
                      </option>

                      <option value="#">
                        #
                      </option>
                    </select>

                    <button
                      onClick={() =>
                        deleteAttribute(
                          attribute.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>

            {/* METHODS */}

            <div className="panel-section">
              <div className="section-header">
                <h3>
                  Methods
                </h3>

                <button onClick={addMethod}>
                  + Add
                </button>
              </div>

              {selectedNode.data.methods.map(
                (method) => (
                  <div
                    className="method-editor"
                    key={method.id}
                  >
                    <div className="property-row">
                      <input
                        value={method.name}
                        onChange={(event) =>
                          updateMethod(
                            method.id,
                            "name",
                            event.target.value
                          )
                        }
                      />

                      <input
                        value={
                          method.returnType
                        }
                        onChange={(event) =>
                          updateMethod(
                            method.id,
                            "returnType",
                            event.target.value
                          )
                        }
                      />

                      <select
                        value={
                          method.visibility
                        }
                        onChange={(event) =>
                          updateMethod(
                            method.id,
                            "visibility",
                            event.target.value
                          )
                        }
                      >
                        <option value="+">
                          +
                        </option>

                        <option value="-">
                          -
                        </option>

                        <option value="#">
                          #
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          deleteMethod(
                            method.id
                          )
                        }
                      >
                        ×
                      </button>
                    </div>

                    {/* PARAMETERS */}

                    <div className="parameters-section">
                      <div className="parameters-header">
                        <span>
                          Parameters
                        </span>

                        <button
                          onClick={() =>
                            addParameter(
                              method.id
                            )
                          }
                        >
                          + Add
                        </button>
                      </div>

                      {(method.parameters || []).map(
                        (parameter) => (
                          <div
                            className="parameter-row"
                            key={parameter.id}
                          >
                            <input
                              value={
                                parameter.name
                              }
                              placeholder="name"
                              onChange={(event) =>
                                updateParameter(
                                  method.id,
                                  parameter.id,
                                  "name",
                                  event.target.value
                                )
                              }
                            />

                            <input
                              value={
                                parameter.type
                              }
                              placeholder="type"
                              onChange={(event) =>
                                updateParameter(
                                  method.id,
                                  parameter.id,
                                  "type",
                                  event.target.value
                                )
                              }
                            />

                            <button
                              onClick={() =>
                                deleteParameter(
                                  method.id,
                                  parameter.id
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </aside>
        )}
      </div>

      {/* GENERATED JAVA */}

      {generatedCode && (
        <section className="code-panel">
          <div className="code-panel-header">
            <h2>
              Generated Java Code
            </h2>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  generatedCode
                )
              }
            >
              Copy Code
            </button>
          </div>

          <pre>
            <code>
              {generatedCode}
            </code>
          </pre>
        </section>
      )}
    </div>
  );
}

export default App;
