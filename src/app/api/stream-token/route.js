import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function POST(request) {
  const userId = Number(request.cookies.get('userId').value);

  // Define Stream values.
  const api_key = process.env.STREAM_APP_KEY;
  const api_secret = process.env.STREAM_APP_SECRET;

  // Initialize a Server Client
  const serverClient = StreamChat.getInstance(api_key, api_secret);

  // Create User Token for the authenticated user
  const token = serverClient.createToken(String(userId));

  // Return the Stream token along with the existing payload
  return NextResponse.json({ ok: true, token, userId });
}
