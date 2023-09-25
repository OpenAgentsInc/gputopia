import { NextResponse } from 'next/server'
import mysql from 'mysql2';

export async function POST(request) {
  const json = await request.json();
  const email = json.email || "default@email.com";
  const connection = mysql.createConnection(process.env.DATABASE_URL)

  return new Promise((resolve, reject) => {
    connection.query('SELECT balance,total_sats_earned FROM users WHERE email = ?', [email], function (err, results) {
      connection.end();

      if (err) {
        resolve(NextResponse.json({ error: "Database error" }));
        return;
      }

      console.log(results)

      resolve(NextResponse.json({
        balance: results[0].balance ?? null,
        totalSatsEarned: results[0].total_sats_earned ?? null
      }));
    });
  });
}
