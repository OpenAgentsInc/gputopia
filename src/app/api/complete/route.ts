import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"
import { pusher } from "@/lib/pusher"

export async function POST(request: NextRequest) {
  const json = await request.json();
  const result = json.result;

  const userId = request.cookies.get('userId');
  if (!userId) {
    throw new Error('Missing user ID cookie');
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

  await connection.query(
    'UPDATE users SET balance = balance + 6, total_sats_earned = total_sats_earned + 6 WHERE id = ?',
    [userId.value]
  );

  connection.end();

  // Award availability reward to losing sellers

  try {
    // Grab a list of userIds in the Pusher channel `presence-serving-vicuna`
    const res = await pusher.get({
      path: '/channels/presence-serving-vicuna/users',
    })
    const resJson = await res.json();
    console.log("completeroute: In complete we have resJson:", resJson);
  } catch (e) {
    console.log("completeroute: Error fetching users:", e);
  }


  return NextResponse.json({ result: result });
}
