import { SendWelcomeEmail } from "@/lib/jobs";
import { createHandler } from "@getproductstack/jobs/nextjs";
import { Receiver } from "@upstash/qstash";

export const { POST } = createHandler({
  jobs: [SendWelcomeEmail],
  receiver: new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
  }),
});
