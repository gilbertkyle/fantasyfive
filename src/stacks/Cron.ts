import { Cron, type StackContext } from "sst/constructs";

export function CronStack({ stack }: StackContext) {
  new Cron(stack, "Cron", {
    schedule: "rate(1 minute)",
    job: "src/lambda.handler",
  });
}
