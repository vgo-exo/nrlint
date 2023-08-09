const { config } = require("chai");

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
        var otherwiseCaseExists = false;
        var otherwisePosition;
        if (node.hasOwnProperty("config")) {
          if (node.config.hasOwnProperty("rules")) {
            for (let i = 0; i < node.config.rules.length; i++) {
              const rule = node.config.rules[i];
              if (rule.t === "else") {
                (otherwiseCaseExists = true), (otherwisePosition = i + 1);
              }
            }
          }
        }
        if (!otherwiseCaseExists) {
          context.report({
            location: [node.id],
            message: `Missing "otherwise" case`,
          });
        } else if (otherwisePosition) {
          if (otherwisePosition !== node.config.rules.length) {
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
