module.exports = {
  meta: {
    type: "suggestion",
    severity: "warn",
    docs: {
      description: "EXOTEC : Remove the unused subflows of your project",
    },
  },
  create: function (context, ruleConfig) {
    var instances = [];
    var templates = [];
    var unusedTemplate;
    return {
      start: function () {},
      subflow: function (subflow) {
        if (!subflow.hasOwnProperty("category")) {
          templates.push(subflow);
        } else if (!subflow.category.includes("deploy ")) {
          templates.push(subflow);
        }
      },
      node: function (node) {
        try {
          if (node.type.includes("subflow:")) {
            instances.push(node);
          }
        } catch (error) {
          console.warn(error);
        }
      },
      end: function () {
        for (let i = 0; i < templates.length; i++) {
          const template = templates[i];
          var used = false;
          for (let j = 0; j < instances.length; j++) {
            const instance = instances[j];
            if (instance.type.includes(String(template.id))) {
              used = true;
              break;
            }
          }
          if (!used) {
            context.report({
              location: [template.id],
              message: `Unused subflow should be deleted`,
            });
          }
        }
      },
    };
  },
};
