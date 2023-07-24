module.exports = {
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
        console.log(JSON.parse(JSON.stringify(context.flows)));
        console.log(JSON.parse(JSON.stringify(subflow)));
        if (subflow.hasOwnProperty("info") && subflow.info.length == 0) {
          context.report({
            location: [subflow.id],
            message: "Subflow without any documentation",
          });
        }
        if (
          subflow.hasOwnProperty("in") &&
          subflow.in.length > 0 &&
          subflow.hasOwnProperty("info") &&
          !subflow.info.includes("# Mandatory inputs")
        ) {
          context.report({
            location: [subflow.id],
            message:
              "Subflow has an input but not documented. Info should have the exact heading '# Mandatory inputs'",
          });
        }
      },
    };
  },
};
