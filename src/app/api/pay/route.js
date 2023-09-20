export async function POST(request) {
  const json = await request.json();
  const { payment_request, payment_hash, expires_at, amount } = json;

  const userId = Number(request.cookies.get('userId').value);

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  await connection.beginTransaction();  // Begin transaction

  try {
    // Lock the user's row
    const [rows] = await connection.execute(
      'SELECT balance FROM users WHERE id = ? FOR UPDATE',
      [userId]
    );
    const currentBalance = rows[0]?.balance || 0;

    if (currentBalance < amount) {
      await connection.rollback();
      return NextResponse.json({ ok: false, error: 'Insufficient balance' });
    }

    // Insert into Payments table
    await connection.execute(
      'INSERT INTO payments (user_id, invoice_expires_at, invoice_payment_hash, invoice_payment_request, amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [userId, expires_at, payment_hash, payment_request, amount]
    );

    // Make the actual payment
    // (Assuming this is a synchronous operation that either succeeds or throws an exception)
    const payResponse = await fetch(`${process.env.LNBITS_BASE_URL}/payments`, {
      // ... (same as your existing code)
    });

    const payJson = await payResponse.json();
    if (payResponse.ok) {
      await connection.execute(
        'UPDATE users SET balance = balance - ? WHERE id = ?',
        [amount, userId]
      );
    } else {
      await connection.rollback();
      return NextResponse.json({ ok: false, ...payJson });
    }

    await connection.commit();  // Commit transaction

    return NextResponse.json({ ok: true, ...payJson });

  } catch (error) {
    await connection.rollback();  // Rollback transaction in case of an error
    return NextResponse.json({ ok: false, error });
  } finally {
    connection.end();
  }
}
