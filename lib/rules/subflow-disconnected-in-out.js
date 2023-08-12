warnObject = module.exports = {
  meta: {
    type: "suggestion",
    severity: "error",
    docs: {
      description:
        "EXOTEC : detects missing wires to inputs and outputs in subflows.",
    },
  },
  create: function (context, ruleConfig) {
    var disconnectedOutputs = [];
    return {
      subflow: function (subflow) {
        if (subflow.hasOwnProperty("in")) {
          if (subflow.in.length > 0) {
            if (subflow.in[0].hasOwnProperty("wires")) {
              if (subflow.in[0].wires.length == 0) {
                context.report({
                  location: [subflow.id],
                  message: `Input disconnected`,
                });
              }
            }
          }
        }
        if (subflow.hasOwnProperty("out")) {
          if (subflow.out.length > 0) {
            subflow.out.forEach((out, i) => {
              if (out.hasOwnProperty("wires")) {
                if (out.wires.length == 0) {
                  disconnectedOutputs.push(i + 1);
                }
              }
            });
          }
        }
        if (disconnectedOutputs.length > 0) {
          context.report({
            location: [subflow.id],
            message: `Output${
              disconnectedOutputs.length > 1 ? "s" : ""
            } ${disconnectedOutputs} disconnected`,
          });
        }
      },
    };
  },
};
