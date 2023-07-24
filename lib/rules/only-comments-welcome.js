function getWelcomeFlow(ctx) {
  for (let i = 0; i < ctx.flows; i++) {
    const f = ctx.flows[i];
    if (
      f.hasOwnProperty("type") &&
      f.type == "tab" &&
      f.hasOwnProperty("label") &&
      f.label.toUpperCase() == "WELCOME"
    ) {
      return f.id;
    }
  }
  return null;
}

module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "Welcome flow should exist and contain only comment nodes.",
    },
  },
  create: function (context, ruleConfig) {
    console.log("context", context);
    const welcomeFlowId = getWelcomeFlow(context);
    console.log("welcomeFlowId", welcomeFlowId);
    // if (!welcomeFlowId) {
    //   return {
    //     context.report({
    //       location: [node.id],
    //       message: `${node.type} node on Welcome flow`,
    //     })
    //   }
    // }
    return {
      node: function (node) {
        if (
          node.hasOwnProperty("z") &&
          node.z == welcomeFlowId &&
          node.hasOwnProperty("type") &&
          node.type != "comment"
        ) {
          console.log("Found a non-comment !", node.id);
          context.report({
            location: [node.id],
            message: `${node.type} node on Welcome flow`,
          });
        }
      },
    };
  },
};
