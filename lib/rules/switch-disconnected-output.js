module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "EXOTEC : All switch nodes outputs should be connected",
    },
  },
  create: function (context, ruleConfig) {
    return {
      "type:switch": function (node) {
        var connectedOutputs = [];
        if (node.hasOwnProperty("outputCount") && node.outputCount > 0) {
          if (node.hasOwnProperty("wires")) {
            for (let i = 0; i < node.wires.length; i++) {
              const wire = node.wires[i];
              if (wire.length > 0) {
                connectedOutputs.push(wire[0]);
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
      },
    };
  },
};
