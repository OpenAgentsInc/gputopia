import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'

async function timer(secs: number) {
    await new Promise(resolve => setTimeout(resolve, secs * 1000));
    throw new Error('Timeout occurred');
}

export async function POST(request: NextRequest) {
    const json = await request.json();

    const userId = Number(request.cookies.get('userId').value);
    const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

    const { verify } = json
    
    console.log("verify", userId, verify)

    let ok = false

    const doneWaiting = Date.now() + 20000

    while (!ok && Date.now() < doneWaiting) {
        let res = await fetch(verify);
        if (res.status !== 200) {
            throw new Error(`Error: payment verification failure ${res.status}`);
        }
        if ((await res.json()).settled) {
            ok = true;
        }
        await timer(3000)
    }

    if (ok) {
        await connection.execute(
            'UPDATE users SET balance = balance - ? WHERE id = ?',
            [amount, userId]
          );
      
        await connection.execute(
            'INSERT INTO payments (user_id, invoice_expires_at, invoice_payment_hash, invoice_payment_request, amount, invoice_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [userId, expires_at, payment_hash, payment_request, amount, "pending"]
          );
        await connection.query("")
    }
    connection.end();

    return NextResponse.json({ ok })
}
