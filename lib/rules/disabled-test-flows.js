module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : TEST flows used for unitary / end-to-end tests should be disabled by default",
    },
  },
  create: function (context, ruleConfig) {
    return {
      flow: function (flow) {
        try {
          if (
            flow.config.label.toUpperCase().includes("TEST") &&
            flow.disabled !== true
          ) {
            context.report({
              location: [flow.id],
              message: "Enabled Test flow",
            });
          }
        } catch (error) {}
      },
    };
  },
};
