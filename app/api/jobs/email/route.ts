import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sendEmail } from "../../utils/email";

export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const data = await req.json();
    const { body, recipient, subject } = data as {
      recipient: string;
      subject: string;
      body: string;
    };
    await sendEmail("addaconficius@yahoo.com", subject, body);
    return new Response(`Welcome email sent sucessfully`);
  } catch (error) {
    console.error(error);
    throw error;
  }
});
