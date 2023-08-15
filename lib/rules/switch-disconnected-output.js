module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "EXOTEC : All switch nodes outputs should be connected",
    },
  },
  create: function (context, ruleConfig) {
    var switches = [];
    var subflowOutputs = [];
    return {
      subflow: function (subflow) {
        if (subflow.hasOwnProperty("out")) {
          if (subflow.out.length > 0) {
            subflow.out.forEach((out) => {
              if (out.hasOwnProperty("wires")) {
                if (out.wires.length > 0) {
                  out.wires.forEach((wire) => {
                    subflowOutputs.push(wire.id);
                  });
                }
              }
            });
          }
        }
      },
      "type:switch": function (node) {
        switches.push(node);
      },
      end: function () {
        switches.forEach((node) => {
          var connectedOutputs = [];
          if (node.hasOwnProperty("outputCount") && node.outputCount > 0) {
            if (node.hasOwnProperty("wires")) {
              for (let i = 0; i < node.wires.length; i++) {
                const wire = node.wires[i];
                if (wire.length > 0) {
                  connectedOutputs.push(wire[0]);
                } else if (subflowOutputs.includes(node.id)) {
                  connectedOutputs.push(`subflow-output-${node.id}`);
                  var index = subflowOutputs.indexOf(node.id);
                  if (index > -1) {
                    subflowOutputs.splice(index, 1);
                  }
                }
              }
            }
          }
          nbDisconnectedOutputs = node.outputCount - connectedOutputs.length;
          if (nbDisconnectedOutputs > 0) {
            context.report({
              location: [node.id],
              message: `${nbDisconnectedOutputs} disconnected outputs`,
            });
          }
        });
      },
    };
  },
};
