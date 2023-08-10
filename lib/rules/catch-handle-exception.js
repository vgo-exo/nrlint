module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
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
    var handleTemplateId;
    var subflowsInstances = [];
    const handleInstancesIdList = [];
    return {
      start: function () {},
      subflow: function (subflow) {
        if (subflow.hasOwnProperty("type")) {
          // console.log(JSON.stringify(Object.keys(subflow)));
          console.log(JSON.parse(JSON.stringify(subflow)));
          if (subflow.type.includes("subflow:")) {
            subflowsInstances.push(subflow);
          }
        }
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
          if (node.parent.type === "tab") {
            catchNodes.push(node);
          }
        }
      },
      "name:handle internal exception": function (node) {
        if (node.hasOwnProperty("id")) {
          handleTemplateId = node.id;
        }
      },
      end: function () {
        if (welcomeFlowId) {
          okFlowsIds.push(welcomeFlowId);
        }
        catchNodes.forEach(function (node) {
          if (node.hasOwnProperty("z") && !okFlowsIds.includes(node.z)) {
            okFlowsIds.push(node.z);
          }
          if (node.hasOwnProperty("wires")) {
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
        // console.log("allflowIds", allflowIds);
        // console.log("okFlowsIds", okFlowsIds);
        allflowIds.forEach(function (id) {
          if (!okFlowsIds.includes(id)) {
            context.report({
              location: [id],
              message: `Missing catch node on flow. It should be connected to "handle internal exception"`,
            });
          }
        });
      },
    };
  },
};
