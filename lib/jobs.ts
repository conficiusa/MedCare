import { sendEmail } from "@/app/api/utils/email";
import { createManager } from "@getproductstack/jobs";
import { Client } from "@upstash/qstash";

const { createJob } = createManager({
  client: new Client({ token: process.env.QSTASH_TOKEN as string }),
  endpoint: "https://medcare-hub.vercel.app/api/jobs",
});

export const SendWelcomeEmail = createJob(
  "welcome-email",
  async (payload: { recipient: string; subject: string; body: string }) => {
    const { recipient, body, subject } = payload;
    await sendEmail(recipient, subject, body);
  }
);
