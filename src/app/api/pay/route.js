import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise';

export async function POST(request) {
  const json = await request.json();

  const payment_request = json.payment_request;
  const payment_hash = json.payment_hash;
  const expires_at = json.expires_at;
  const amount = json.amount;

  const userId = Number(request.cookies.get('userId').value);
  console.log('sup userId', userId)

  // Create MySQL connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  // Insert into Payments table
  await connection.execute(
    'INSERT INTO payments (user_id, invoice_expires_at, invoice_payment_hash, invoice_payment_request, amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [userId, expires_at, payment_hash, payment_request, amount]
  );

  const payResponse = await fetch(`${process.env.LNBITS_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.LNBITS_API_KEY,
    },
    body: JSON.stringify({
      "out": true,
      "bolt11": payment_request,
    })
  })

  const payJson = await payResponse.json();
  // If payment is successful, deduct amount from user's balance
  if (payResponse.ok) {
    await connection.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, userId]
    );
  }

  console.log(payJson)

  return NextResponse.json({ ok: true, ...payJson })
}
