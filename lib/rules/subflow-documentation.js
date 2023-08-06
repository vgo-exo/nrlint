warnObject = module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : all subflows should be documented with a certain template.",
    },
    options: {
      categoriesToIgnore: {
        type: "string",
        default:
          "deploy templates common,deploy templates iobox,deploy templates machines",
      },
    },
  },
  create: function (context, ruleConfig) {
    var subflows = [];
    var categoriesToIgnoreStr =
      "deploy templates common,deploy templates iobox,deploy templates machines";
    if ("categoriesToIgnore" in ruleConfig) {
      categoriesToIgnoreStr += "," + ruleConfig.categoriesToIgnore;
    }
    categoriesToIgnoreList = categoriesToIgnoreStr.split(",") || [];
    console.log(categoriesToIgnoreList);
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
        });
      },
    };
  },
};
