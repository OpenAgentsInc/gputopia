import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise';

export async function POST(request) {
  const json = await request.json();
  const result = json.result;

  const userId = request.cookies.get('userId');

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  await connection.query(
    'UPDATE users SET balance = balance + 6, total_sats_earned = total_sats_earned + 6 WHERE id = ?',
    [userId.value]
  );

  try {
    console.log(`User ${userId.value} has completed a job with result ${result}`)
  } catch (e) { }


  connection.end();

  return NextResponse.json({ result: result });
}
