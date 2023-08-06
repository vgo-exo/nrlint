warnObject = module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : all subflows should be documented with a certain template",
    },
    options: {
      categoriesToIgnore: { type: "string", default: null },
    },
  },
  create: function (context, ruleConfig) {
    let categoriesToIgnore = [];
    if ("categoriesToIgnore" in ruleConfig) {
      categoriesToIgnore = ruleConfig.categoriesToIgnore.split(",") || [];
    }
    return {
      subflow: function (subflow) {
        if (
          !subflow.hasOwnProperty("info") ||
          typeof subflow.info === "undefined" ||
          subflow.info.length == 0
        ) {
          context.report({
            location: [subflow.id],
            message: "Subflow without any written documentation",
          });
        }
        if (
          subflow.hasOwnProperty("in") &&
          subflow.in.length > 0 &&
          typeof subflow.info !== "undefined" &&
          !subflow.info.toUpperCase().includes("# MANDATORY INPUTS")
        ) {
          context.report({
            location: [subflow.id],
            message: `Subflows with input should have the exact heading "# Mandatory inputs" in their documentation`,
          });
        }
      },
    };
  },
};
