module.exports = {
  meta: {
    type: "suggestion",
    severity: "error",
    docs: {
      description:
        "EXOTEC : Every flow should have a catch + handle internal exception.",
    },
  },
  create: function (context, ruleConfig) {
    var welcomeFlowId;
    var allflowIds = [];
    var okFlowsIds = [];
    var catchNodes = [];
    var handleInstancesIdList = [];
    var duplicates = [];
    return {
      start: function () { },
      node: function (node) {
        try {
          if (
            node.type.includes("subflow:") &&
            node.subflow.config.name === "handle internal exception"
          ) {
            handleInstancesIdList.push(node.id)
          }
        } catch (error) { }
      },
      flow: function (flow) {
        if (flow.hasOwnProperty("id") && flow.hasOwnProperty("config")) {
          if (
            flow.config &&
            flow.config.label &&
            (flow.config.label.toUpperCase() === "WELCOME" ||
              flow.config.label.toUpperCase() === "WELCOME!" ||
              flow.config.label.toUpperCase() === "WELCOME !")
          ) {
            welcomeFlowId = flow.id;
          }
        }
        if (flow.hasOwnProperty("id")) {
          allflowIds.push(flow.id);
        }
      },
      "type:catch": function (node) {
        if (node.hasOwnProperty("parent")) {
          if (node.parent.type === "tab" && node.config.uncaught == true) {
            catchNodes.push(node);
          }
        }
      },
      end: function () {
        if (welcomeFlowId) {
          okFlowsIds.push(welcomeFlowId);
        }
        catchNodes.forEach(function (node) {
          if (node.hasOwnProperty("z")) {
            if (!okFlowsIds.includes(node.z)) {
              okFlowsIds.push(node.z);
            } else {
              duplicates.push(node.id);
              context.report({
                location: [node.id],
                message: `Duplicate catch:uncaught node for this flow`,
              });
            }
          }
        });
        catchNodes.forEach(function (node) {
          if (!duplicates.includes(node.id) && node.hasOwnProperty("wires")) {
            if (node.wires[0].length > 0) {
              var handleExists = false;
              node.wires[0].forEach(function (wire) {
                if (handleInstancesIdList.includes(wire)) {
                  handleExists = true;
                }
              });
              if (!handleExists) {
                context.report({
                  location: [node.id],
                  message: `Catch node should be connected to "handle internal exception"`,
                });
              }
            } else {
              context.report({
                location: [node.id],
                message: `Catch node should be connected to "handle internal exception"`,
              });
            }
          }
        });
        allflowIds.forEach(function (id) {
          if (!okFlowsIds.includes(id)) {
            context.report({
              location: [id],
              message: `Missing catch:uncaught node on this flow. It should be connected to "handle internal exception"`,
            });
          }
        });
      },
    };
  },
};
