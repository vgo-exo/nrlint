module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : Debug nodes should only be used in unitary tests but not exist in the final file. Usage of standard 'log' node is encouraged",
    },
  },
  create: function (context, ruleConfig) {
    return {
      node: function (node) {
        if (node.hasOwnProperty("type")) {
          if (node.type === "debug") {
            context.report({
              location: [node.id],
              message: `debug nodes should be replaced by a log node`,
            });
          }
        }
      },
    };
  },
};
