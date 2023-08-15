module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "ensure all Template nodes have a name",
    },
  },
  create: function (context, ruleConfig) {
    return {
      "type:template": function (node) {
        if (!node.config.name) {
          context.report({
            location: [node.id],
            message: "Template node has no name",
          });
        }
      },
    };
  },
};
