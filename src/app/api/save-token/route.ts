import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { fetchUser } from "@/lib/alby"

export async function POST(request: NextRequest) {

  try {
    // Get token details from request
    const body = await request.json();
    const { token, refresh_token } = body;

    if (!token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'Missing token or refresh_token' });
    }

    // Connect to MySQL
    const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

    // Save the token in the access_tokens table


    const albyUser = await fetchUser()
    if (!albyUser) {
      return NextResponse.json({ ok: false, error: 'Error fetching user' });
    }
    console.log("Got user:", albyUser)

    // Look to see if there's a user with this alby_id
    const user = await connection.execute(
      'SELECT * FROM users WHERE alby_id = ?',
      [albyUser.alby_id]
    );

    // If there is, save the token with this user id
    await connection.execute(
      'INSERT INTO access_tokens (user_id, token, refresh_token, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [user_id, token, refresh_token]
    );

    // If there isn't, create the user
    await connection.execute(
      'INSERT INTO users (alby_id, name, email, avatar, lightning_address, keysend_pubkey, keysend_custom_key, keysend_custom_value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [albyUser.alby_id, albyUser.name, albyUser.email, albyUser.avatar, albyUser.lightning_address, albyUser.keysend_pubkey, albyUser.keysend_custom_key, albyUser.keysend_custom_value]
    );

    connection.end();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving token:", err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' });
  }
}
