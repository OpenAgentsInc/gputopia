import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(request) {
  // Get the user ID
  const userIdString = req.cookies.get('userId')
  if (!userIdString) {
    throw new Error('Missing user ID cookie')
  }
  const userId = Number(userIdString.value)

  let connection

  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL)

    const query = `
      SELECT id, invoice_expires_at, invoice_payment_hash, invoice_payment_request,
      amount, invoice_status, created_at, updated_at
      FROM payments
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 25
    `

    const [results] = await connection.query(query, [userId])

    const payments = results.map(row => ({
      id: row.id,
      invoiceExpiresAt: row.invoice_expires_at,
      invoicePaymentHash: row.invoice_payment_hash,
      invoicePaymentRequest: row.invoice_payment_request,
      amount: row.amount,
      invoiceStatus: row.invoice_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))

    return NextResponse.json({ payments })
  } catch (err) {
    return NextResponse.json({ error: 'Database error' })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
