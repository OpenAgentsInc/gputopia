
import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"

export async function POST(request: NextRequest) {
  const formDataText = await request.text();
  const formData = new URLSearchParams(formDataText);
  const socket_id = formData.get('socket_id') as string

  const authResponse = pusher.authorizeChannel(socket_id, "presence-common_room", {
    user_id: "1",
    user_info: {
      name: "John Smith",
    }
  });

  return NextResponse.json({
    auth: authResponse.auth,
    channel_data: authResponse.channel_data,
  })
}
