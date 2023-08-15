module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : All switch nodes should have a 'otherwise' case as the last option",
    },
  },
  create: function (context, ruleConfig) {
    return {
      "type:switch": function (node) {
        var rules = [];
        var otherwiseCaseExists = false;
        var otherwisePosition;
        if (node.hasOwnProperty("config")) {
          if (node.config.hasOwnProperty("rules")) {
            for (let i = 0; i < node.config.rules.length; i++) {
              const rule = node.config.rules[i];
              rules.push(rule);
              if (rule.t === "else") {
                (otherwiseCaseExists = true), (otherwisePosition = i + 1);
              }
            }
          }
        }
        if (!otherwiseCaseExists && rules.length > 1) {
          context.report({
            location: [node.id],
            message: `Missing "otherwise" case`,
          });
        } else if (otherwiseCaseExists) {
          if (otherwisePosition !== rules.length) {
            context.report({
              location: [node.id],
              message: `"otherwise" is not the last option`,
            });
          }
        }
      },
    };
  },
};
