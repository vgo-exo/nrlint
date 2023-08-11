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
        try {
          if (!subflow.category.includes("deploy ")) {
            templates.push(subflow);
          }
        } catch (error) {}
      },
      flow: function (flow) {},
      node: function (node) {
        try {
          if (node.type.includes("subflow:")) {
            instances.push(node);
          }
        } catch (error) {}
      },
      end: function () {
        for (let i = 0; i < templates.length; i++) {
          const template = templates[i];
          for (let j = 0; j < instances.length; j++) {
            const instance = instances[j];
            if (instance.type.includes(String(template.id))) {
            }
          }
        }
      },
    };
  },
};
