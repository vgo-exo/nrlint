module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : 'Throw internal exception' is an obsolete subflow from the deploy-catalog and should not be used in any project.",
    },
  },
  create: function (context, ruleConfig) {
    var subflowInstancesNodes = [];
    var tieSubflowId;
    return {
      start: function () {},
      subflow: function (subflow) {
        // console.log(JSON.stringify(subflow));
        if (subflow.hasOwnProperty("config")) {
          if (
            subflow.config.name.toUpperCase() == "THROW INTERNAL EXCEPTION" &&
            subflow.category.toUpperCase().includes("DEPLOY")
          ) {
            tieSubflowId = subflow.id;
          }
        }
      },
      node: function (node) {
        if (node.type.includes("subflow:")) {
          subflowInstancesNodes.push(node);
        }
      },
      end: function () {
        if (tieSubflowId) {
          subflowInstancesNodes.forEach(function (instance) {
            if (instance.type.includes(tieSubflowId)) {
              context.report({
                location: [instance.id],
                message: `Instance of "Throw internal exception". It must be replaced by a standard log node with ERROR level`,
              });
            }
          });
          context.report({
            location: [tieSubflowId],
            message: `"Throw internal exception" catalog subflow is obsolete and should be removed from your project`,
          });
        }
      },
    };
  },
};
