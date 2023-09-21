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
  const presence: any = await pusher.get({ path: '/channels/presence-common_room/users' })
  const json = await presence.json()
  const users = json.users // [ { id: '1' } ]

  // Loop through each user and send a message
  for (const user of users) {
    const { id } = user;
    await pusher.trigger(`private-user-${id}`, 'JobAssigned', {
      job: `Write one sentence about the history of the number ${id}.`,
    });
  }

  return NextResponse.json({ ok: true, users: users.length });
}
