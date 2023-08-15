module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : Using a template node for a SQL query should edit msg.query",
    },
  },
  create: function (context, ruleConfig) {
    return {
      "type:template": function (node) {
        if (
          node.config.format === "sql" &&
          (node.config.fieldType !== "msg" ||
            (node.config.field !== "query" &&
              node.config.field !== "query.text"))
        ) {
          context.report({
            location: [node.id],
            message: "Template should edit msg.query for a SQL query",
          });
        }
      },
    };
  },
};
