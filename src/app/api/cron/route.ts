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
    const token = process.env.CRON_AI_TOKEN
    const response = await fetch("https://queenbee.gputopia.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
        gpu_filter: {worker_id: id},
        model: "vicuna-v1-7b-q4f32_0",
        messages: [
          {
            "role": "system",
            "content": "You are a terse, brusque assistant"
          },
          {
            "role": "user",
            "content": `Write one sentence about the number ${id}`
          }
        ],
        max_tokens: 200
      }
    )});
    console.log("CRON OUT", await response.text())
  }

  return NextResponse.json({ ok: true, users: users.length });
}
