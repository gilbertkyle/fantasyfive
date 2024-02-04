import type { SSTConfig } from "sst";
import { NextjsSite, Cron } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "fantasyfive-t3",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site");
      /* new Cron(stack, "cron", {
        schedule: "rate(1 minute)",
        job: "src/lambda.handler",
      }); */
      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
