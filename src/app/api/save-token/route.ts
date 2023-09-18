import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { fetchUser } from "@/lib/alby"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, refresh_token } = body;

    if (!token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'Missing token or refresh_token' });
    }

    const albyUser = await fetchUser(token);
    if (!albyUser) {
      throw new Error("Error fetching user");
      // return NextResponse.json({ ok: false, error: 'Error fetching user' });
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

    // @ts-ignore
    connection.query('SELECT * FROM users WHERE alby_id = ?', [albyUser.alby_id], async function (err, results) {
      console.log('so test')
      if (err) {
        connection.end();
        return NextResponse.json({ ok: false, error: 'Database error' });
      }

      if (results.length > 0) {
        const userId = results[0].id;
        await connection.query(
          'INSERT INTO access_tokens (user_id, token, refresh_token, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
          [userId, token, refresh_token]
        );
      } else {
        await connection.query(
          'INSERT INTO users (alby_id, name, email, avatar, lightning_address, keysend_pubkey, keysend_custom_key, keysend_custom_value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [albyUser.alby_id, albyUser.name, albyUser.email, albyUser.avatar, albyUser.lightning_address, albyUser.keysend_pubkey, albyUser.keysend_custom_key, albyUser.keysend_custom_value]
        );

        const insertResults = await connection.query('SELECT LAST_INSERT_ID() as id');
        const userId = insertResults[0].id;

        await connection.query(
          'INSERT INTO access_tokens (user_id, token, refresh_token, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
          [userId, token, refresh_token]
        );
      }

      connection.end();
      return NextResponse.json({ ok: true });
    });
  } catch (err) {
    console.error("Error saving token:", err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' });
  }
}
