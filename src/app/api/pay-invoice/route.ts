import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const json = await request.json();
  const payment_request = json.payment_request;

  // Get the user ID
  const userIdString = request.cookies.get('userId');
  if (!userIdString) {
    throw new Error("Missing user ID cookie");
  }
  const userId = Number(userIdString.value);

  // Get payment details from Alby
  const albyResponse = await fetch(`https://api.getalby.com/decode/bolt11/${payment_request}`);
  const albyData = await albyResponse.json();

  const payment_hash = albyData.payment_hash;
  const expires_at = albyData.created_at + albyData.expiry;
  console.log(albyData)
  const amount = albyData.amount;
  console.log(amount)

  // Create MySQL connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

  await connection.beginTransaction();
  try {
    // Check balance and lock the row for the current transaction
    const [rows] = await connection.execute(
      'SELECT balance FROM users WHERE id = ? FOR UPDATE',
      [userId]
    ) as any;
    const currentBalance = rows[0]?.balance || 0;

    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Insert into Payments table
    await connection.execute(
      'INSERT INTO payments (user_id, invoice_expires_at, invoice_payment_hash, invoice_payment_request, amount, invoice_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [userId, expires_at, payment_hash, payment_request, amount, "pending"]
    );

    // Update the balance
    await connection.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [amount, userId]
    );

    // Commit the transaction
    await connection.commit();

    const payResponse = await fetch(`${process.env.LNBITS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.LNBITS_API_KEY as string,
      },
      body: JSON.stringify({
        "out": true,
        "bolt11": payment_request,
      })
    })

    // If payment is successful, update the payment record by setting invoice_status to settled
    if (payResponse.ok) {
      await connection.execute(
        'UPDATE payments SET invoice_status = "settled" WHERE invoice_payment_hash = ?',
        [payment_hash]
      );
    }
  } catch (err: any) {
    // Rollback in case of an error
    await connection.rollback();
    return NextResponse.json({ ok: false, error: err.message });
  } finally {
    await connection.end(); // Close the connection
  }

  return NextResponse.json({ ok: true });
}
