module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : Debug nodes should only be used in unitary tests but not exist in the final file. Usage of standard 'log' node is encouraged",
    },
    options: {
      ignoreTestFlows: {
        type: "boolean",
        default: true,
      },
    },
  },
  create: function (context, ruleConfig) {
    let ignoreTestFlows = true;
    if ("ignoreTestFlows" in ruleConfig) {
      ignoreTestFlows = ruleConfig.ignoreTestFlows || true;
    }
    var testFlowsId = [];
    var nodes = [];
    return {
      flow: function (flow) {
        try {
          if (flow.config.label.toUpperCase().includes("TEST")) {
            testFlowsId.push(flow.id);
          }
        } catch (error) {}
      },
      node: function (node) {
        nodes.push(node);
      },
      end: function () {
        nodes.forEach((node) => {
          if (node.hasOwnProperty("type")) {
            if (node.type === "debug") {
              if (!ignoreTestFlows || !testFlowsId.includes(node.z)) {
                context.report({
                  location: [node.id],
                  message: `Debug node should be replaced by a standard "log" node`,
                });
              }
            }
          }
        });
      },
    };
  },
};
