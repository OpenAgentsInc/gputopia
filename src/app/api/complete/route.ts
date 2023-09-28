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

  // Award availability reward to losing sellers
  let userIdsArray: string[] = [];
  try {
    // Grab a list of userIds in the Pusher channel `presence-serving-vicuna`
    const res = await pusher.get({
      path: '/channels/presence-serving-vicuna/users',
    })
    const resJson = await res.json();
    userIdsArray = resJson.users.map((user: { id: string }) => user.id);
    console.log(`completeroute: In complete we have resJson: ${JSON.stringify(resJson)}`);
    // Update balance for all users in the list
    const query = 'UPDATE users SET balance = balance + 1, total_sats_earned = total_sats_earned + 1 WHERE id IN (?)';
    await connection.query(query, [userIdsArray]);
    console.log(`completeroute: Updated balance for ${userIdsArray.length} users`);
  } catch (e) {
    console.log("completeroute: Error fetching users:", e);
  }

  connection.end();

  return NextResponse.json({ result: result });
}
