import {
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "@xyflow/react";

function UMLEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath, labelX, labelY] =
    getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 8,
    });

  const relationshipType =
    data?.relationshipType || "association";

  const markerEnd =
    relationshipType === "inheritance" ||
    relationshipType === "dependency"
      ? `url(#${relationshipType}-arrow-${id})`
      : undefined;

  const markerStart =
    relationshipType === "aggregation" ||
    relationshipType === "composition"
      ? `url(#${relationshipType}-diamond-${id})`
      : undefined;

  return (
    <>
      <defs>
        {/* Inheritance: hollow triangle */}
        <marker
          id={`inheritance-arrow-${id}`}
          markerWidth="14"
          markerHeight="14"
          refX="12"
          refY="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 0 0 L 14 7 L 0 14 Z"
            fill="white"
            stroke="#222"
            strokeWidth="1.5"
          />
        </marker>

        {/* Dependency: open arrow */}
        <marker
          id={`dependency-arrow-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 1 1 L 10 6 L 1 11"
            fill="none"
            stroke="#222"
            strokeWidth="1.5"
          />
        </marker>

        {/* Aggregation: hollow diamond */}
        <marker
          id={`aggregation-diamond-${id}`}
          markerWidth="18"
          markerHeight="18"
          refX="5"
          refY="9"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 1 9 L 9 2 L 17 9 L 9 16 Z"
            fill="white"
            stroke="#222"
            strokeWidth="1.5"
          />
        </marker>

        {/* Composition: filled diamond */}
        <marker
          id={`composition-diamond-${id}`}
          markerWidth="18"
          markerHeight="18"
          refX="5"
          refY="9"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 1 9 L 9 2 L 17 9 L 9 16 Z"
            fill="#222"
            stroke="#222"
            strokeWidth="1.5"
          />
        </marker>
      </defs>

      <path
        id={id}
        d={edgePath}
        className={`uml-edge ${relationshipType}`}
        fill="none"
        markerStart={markerStart}
        markerEnd={markerEnd}
      />

      <EdgeLabelRenderer>
        <div
          className="edge-label"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {relationshipType}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default UMLEdge;