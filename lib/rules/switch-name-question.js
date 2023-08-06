module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "EXOTEC : Switch nodes should be questions or switch cases",
    },
  },
  create: function (context, ruleConfig) {
    return {
      "type:switch": function (node) {
        if (
          !node.config.name ||
          (!node.config.name.includes("?") &&
            !node.config.name.toUpperCase().includes("SWITCH ON") &&
            !node.config.name.toUpperCase().includes("SWITCH CASE ON"))
        ) {
          context.report({
            location: [node.id],
            message: "Switch node should be a question",
          });
        }
      },
    };
  },
};
