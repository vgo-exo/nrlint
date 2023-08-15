module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description:
        "EXOTEC : 'Welcome' flow should be the first flow and contain only comment nodes.",
    },
  },
  create: function (context, ruleConfig) {
    var nodes = [];
    var firstFlowId;
    var welcomeFlowId;
    return {
      start: function () {},
      flow: function (flow) {
        if (!firstFlowId && flow.hasOwnProperty("id")) {
          firstFlowId = flow.id;
        }
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
      },
      node: function (node) {
        nodes.push(node);
      },
      end: function () {
        if (!welcomeFlowId) {
          context.report({
            location: [firstFlowId.id],
            message: `"Welcome" flow should exist`,
          });
        } else {
          if (welcomeFlowId !== firstFlowId) {
            context.report({
              location: [firstFlowId.id],
              message: `"Welcome" flow should be the first flow`,
            });
          }
          nodes.forEach(function (node) {
            if (
              node.hasOwnProperty("z") &&
              node.hasOwnProperty("type") &&
              node.hasOwnProperty("id")
            ) {
              if (node.z === welcomeFlowId && node.type !== "comment") {
                context.report({
                  location: [node.id],
                  message: `${node.type} node on "Welcome" flow`,
                });
              }
            }
          });
        }
      },
    };
  },
};
