warnObject = module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : all subflows should be documented.",
    },
    options: {
      categoriesToIgnore: {
        type: "string",
        default: "",
      },
    },
  },
  create: function (context, ruleConfig) {
    var subflows = [];
    var categoriesToIgnoreStr = "";
    if ("categoriesToIgnore" in ruleConfig) {
      categoriesToIgnoreStr = ruleConfig.categoriesToIgnore;
    }
    categoriesToIgnoreList = categoriesToIgnoreStr.split(",") || [];
    return {
      subflow: function (subflow) {
        if (
          subflow.hasOwnProperty("category") &&
          !categoriesToIgnoreList.includes(subflow.category)
        ) {
          subflows.push(subflow);
        }
      },
      end: function () {
        subflows.forEach(function (subflow) {
          if (
            !subflow.hasOwnProperty("info") ||
            typeof subflow.info === "undefined" ||
            subflow.info.length == 0
          ) {
            context.report({
              location: [subflow.id],
              message: `Missing documentation`,
            });
          }
        });
      },
    };
  },
};
