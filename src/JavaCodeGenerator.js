function generateJavaCode(nodes, edges) {
  if (nodes.length === 0) {
    return "// No classes in the diagram.";
  }

  const classes = nodes.map((node) => {
    const data = node.data;

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

    code += `public class ${data.name}`;

    if (parentClass) {
      code += ` extends ${parentClass.data.name}`;
    }

    code += ` {\n\n`;

    // Attributes
    data.attributes.forEach((attribute) => {
      code += `    ${visibilityToJava(
        attribute.visibility
      )}${attribute.type} ${attribute.name};\n`;
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
              `${parameter.type} ${parameter.name}`
          )
          .join(", ") || "";

      code += `    ${visibilityToJava(
        method.visibility
      )}${method.returnType} ${method.name}(${parameters}) {\n`;

      code += `        // TODO: Implement\n`;

      code += `    }\n\n`;
    });

    code += `}\n`;

    return code;
  });

  return classes.join("\n\n");
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