import { Handle, Position } from "@xyflow/react";

function ClassNode({ data }) {
  return (
    <div className="uml-class">
      <Handle
        type="target"
        position={Position.Left}
        className="uml-handle"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="uml-handle"
      />

      <div className="uml-class-name">
        {data.name}
      </div>

      <div className="uml-section">
        {data.attributes.length === 0 ? (
          <div className="empty-section">
            No attributes
          </div>
        ) : (
          data.attributes.map((attribute) => (
            <div key={attribute.id}>
              {attribute.visibility} {attribute.name} :{" "}
              {attribute.type}
            </div>
          ))
        )}
      </div>

      <div className="uml-section">
        {data.methods.length === 0 ? (
          <div className="empty-section">
            No methods
          </div>
        ) : (
          data.methods.map((method) => (
            <div key={method.id}>
              {method.visibility} {method.name}(
              {method.parameters?.map(
                (parameter, index) => (
                  <span key={parameter.id}>
                    {index > 0 && ", "}
                    {parameter.name} : {parameter.type}
                  </span>
                )
              )}
              ) : {method.returnType}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClassNode;