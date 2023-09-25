import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"

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

  return NextResponse.json({ result: result });
}
