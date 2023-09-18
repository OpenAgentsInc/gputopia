import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"

export async function GET(request: NextRequest) {

  pusher.trigger("my-channel", "my-event", {
    message: "hello world"
  });

  return NextResponse.json({ data: "That did what" })
}
