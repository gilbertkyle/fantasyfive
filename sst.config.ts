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
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL:
            "postgresql://gilbertkyle:qXbxNC6fIKE9@ep-calm-waterfall-a6l50wbc.us-west-2.aws.neon.tech/dev?sslmode=require",
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_ZW1lcmdpbmctZG92ZS0xMC5jbGVyay5hY2NvdW50cy5kZXYk",
          CLERK_SECRET_KEY: "sk_test_LPPJPkwpfHKOg00C7LpQxF0z1bsvaXZUmRvg2X0gSq",
          NEXT_PUBLIC_CLERK_AFTER_SIGN_IN: "/",
          NEXT_PUBLIC_CLERK_AFTER_SIGN_UP: "/",
        },
        runtime: "nodejs20.x",
      });
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
