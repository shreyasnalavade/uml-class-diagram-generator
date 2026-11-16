function generateJavaCode(nodes, edges) {
  if (nodes.length === 0) {
    return "// No classes in the diagram.";
  }

  const classes = nodes.map((node) => {
    const data = node.data;
    const className = javaIdentifier(data.name, "GeneratedClass");

    const inheritance = edges.find(
      (edge) =>
        edge.source === node.id &&
        edge.data?.relationshipType === "inheritance"
    );

    const parentClass = inheritance
      ? nodes.find(
          (n) => n.id === inheritance.target
        )
      : null;

    let code = "";

    code += `public class ${className}`;

    if (parentClass) {
      code += ` extends ${javaIdentifier(parentClass.data.name, "GeneratedClass")}`;
    }

    code += ` {\n\n`;

    // Attributes
    data.attributes.forEach((attribute) => {
      code += `    ${visibilityToJava(attribute.visibility)}${javaType(attribute.type)} ${javaIdentifier(attribute.name, "field")};\n`;
    });

    // Non-inheritance UML links are represented as typed references. The
    // association/aggregation/composition owner is the edge source; a
    // dependency remains documented because it does not imply ownership.
    const references = edges
      .filter((edge) => edge.source === node.id && edge.data?.relationshipType !== "inheritance")
      .map((edge) => ({ edge, target: nodes.find((candidate) => candidate.id === edge.target) }))
      .filter(({ target }) => target);
    references.forEach(({ edge, target }, index) => {
      const type = javaIdentifier(target.data.name, "GeneratedClass");
      const relationship = edge.data?.relationshipType || "association";
      if (relationship === "dependency") {
        code += `    // ${relationship}: ${type}\n`;
      } else {
        const fieldName = javaIdentifier(lowerFirst(type), `related${index + 1}`);
        code += `    private ${type} ${fieldName}; // ${relationship}\n`;
      }
    });

    if (data.attributes.length > 0) {
      code += "\n";
    }

    // Methods
    data.methods.forEach((method) => {
      const parameters =
        method.parameters
          ?.map(
            (parameter) =>
              `${javaType(parameter.type)} ${javaIdentifier(parameter.name, "parameter")}`
          )
          .join(", ") || "";

      code += `    ${visibilityToJava(method.visibility)}${javaType(method.returnType)} ${javaIdentifier(method.name, "method")}(${parameters}) {\n`;

      code += `        throw new UnsupportedOperationException("TODO: implement");\n`;

      code += `    }\n\n`;
    });

    code += `}\n`;

    return code;
  });

  return classes.join("\n\n");
}

function javaIdentifier(value, fallback) {
  const cleaned = String(value ?? "").replace(/[^\p{L}\p{N}_$]/gu, "");
  const valid = /^[\p{L}_$]/u.test(cleaned) ? cleaned : `_${cleaned}`;
  const keywords = new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null record sealed permits var yield".split(" "));
  return valid && !keywords.has(valid) ? valid : fallback;
}

function javaType(value) {
  const type = String(value ?? "").trim();
  // Keep common Java type syntax (packages, arrays, and generics), while
  // falling back to Object when the entered type is not a safe type token.
  return /^(?:[\p{L}_$][\p{L}\p{N}_$]*)(?:\.(?:[\p{L}_$][\p{L}\p{N}_$]*))*(?:<[^;{}]+>)?(?:\[\])*$/u.test(type) ? type : "Object";
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function visibilityToJava(visibility) {
  switch (visibility) {
    case "+":
      return "public ";

    case "-":
      return "private ";

    case "#":
      return "protected ";

    default:
      return "";
  }
}

export default generateJavaCode;
