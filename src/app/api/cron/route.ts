import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"

export async function GET(request: NextRequest) {

  // Ensure that the request is coming from the cron server
  const { searchParams } = new URL(request.url);
  const sharedKey = searchParams.get('sharedKey');
  if (!sharedKey || sharedKey !== process.env.CRON_KEY) {
    return NextResponse.json({ ok: false });
  }

  // Get list of everyone online in the Pusher channel
  const presence: any = await pusher.get({ path: '/channels/presence-my-channel/users' })
  const json = await presence.json()
  const users = json.users

  console.log("Users online:", users)

  return NextResponse.json({ ok: true, users });
}
