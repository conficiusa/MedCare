import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const rest = new Ably.Rest(process.env.NEXT_PUBLIC_ABLY_CLIENT_KEY ?? "");
  const { clientId } = params;
  if (!clientId) {
    console.error("failed to generate token, client id ,missing");
  }
  const tokenParams = {
    clientId,
  };
  try {
    const tokenRequest = await rest.auth.createTokenRequest(tokenParams);
    return NextResponse.json(tokenRequest);
  } catch (err) {
    return new NextResponse(`Error requesting token: ${JSON.stringify(err)}`, {
      status: 500,
    });
  }
}
