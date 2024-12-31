import { markAppointmentComplete } from "@/lib/actions";
import { WebhookReceiver } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { sendEmail } from "../../utils/email";
import { Appointment } from "@/lib/definitions";
import { EmailTemplateParams, generateThankYouEmail } from "@/lib/emails";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY as string,
  process.env.LIVEKIT_API_SECRET as string
);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse webhook event
    const event = await receiver.receive(await req.text(), authHeader);
    console.log("event", event);

    // Publish to Ably
    const ablyPublishUrl = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/ably/publish`;
    if (event.event === "participant_left") {
      await fetch(ablyPublishUrl, {
        method: "POST",
        body: JSON.stringify({
          participantId: event.participant?.attributes.user_id,
          disconnectReason: event.participant?.disconnectReason,
          event: "participant_left",
        }),
        headers: { "Content-Type": "application/json" },
      }).catch((error) => {
        console.error("Failed to publish to Ably:", error.message);
      });
    } else if (event.event === "room_finished") {
      const res = await markAppointmentComplete(
        event?.room?.metadata as string
      );
      if ("data" in res) {
        const appointment: Appointment = res?.data;
        const params = {
          doctorName: appointment?.doctor?.name as string,
          patientName: appointment?.patient?.name as string,
          reportIssueLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/report-issue`,
          reviewLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/consultation/review/${appointment?.id}`,
          supportEmail:"addawebadua@gmail.com",
        } satisfies EmailTemplateParams;

        const doctorParams = {
          doctorName: appointment?.doctor?.name as string,
          reviewLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/consultation/review/${appointment?.id}`,
          supportEmail: process.env.SUPPORT_EMAIL as string,
          reportIssueLink: `${process.env.NEXT_PUBLIC_HOSTNAME}/report-issue`,
        } satisfies EmailTemplateParams;
        
        const thankyou = generateThankYouEmail(params);
        await sendEmail(
          appointment?.patient?.email as string,
          "Rate your consultation",
          thankyou
        );
        await sendEmail(
          appointment?.doctor?.email as string,
          "Rate your consultation",
          generateThankYouEmail(doctorParams)
        );
      }
    }
    return NextResponse.json(
      { message: "Webhook received", event },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handling failed", details: error.message },
      { status: 500 }
    );
  }
}
