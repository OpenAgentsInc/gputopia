import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const { token } = body;

    console.log("Saving token:", token)

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Missing token' });
    }

    // Assuming you have a function to save the token and associate with the user
    // saveTokenForUser(token);

    // If you want, you can broadcast an event saying that the user has been authenticated
    // await pusher.trigger('presence-common_room', 'UserAuthenticated', {
    //   message: 'A user has been authenticated'
    // });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving token:", err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' });
  }
}
