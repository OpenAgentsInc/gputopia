import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(request: NextResponse) {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const json = await request.json()
  let auth_key = json.auth_key

  if (!auth_key) {
    const bearer = request.headers.get('Authorization')
    if (bearer && bearer.indexOf(' ')) {
      auth_key = bearer.split(' ')[1]
    }
  }

  if (auth_key != process.env.SPIDER_KEY) {
    return NextResponse.json({ error: 'No authorization' })
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

  const command = json.command

  if (command == 'complete') {
    console.log('payment:', json)

    // todo: use the real billing numbers from the spider
    if (json.pay_to_lnurl) {
      const [results] = await connection.query('SELECT id FROM users WHERE lightning_address = ?', [
        json.pay_to_lnurl
      ])

      if (!results.length) {
        await connection.query(
          'INSERT INTO users (balance, total_sats_earned, lightning_address, alby_id, email) VALUES (6, 6, ?, ?, ?)',
          // use a random alby_id as placeholder
          [
            json.pay_to_lnurl,
            `unknown-${Math.random().toString(36).substring(7)}`,
            `unknown-${Math.random().toString(36).substring(7)}`
          ]
        )
      }

      await connection.query(
        'UPDATE users SET balance = balance + 6, total_sats_earned = total_sats_earned + 6 WHERE lightning_address = ?',
        [json.pay_to_lnurl]
      )
    }

    if (json.bill_to_token) {
      await connection.query('UPDATE users SET balance = balance - 8 WHERE access_token = ?', [
        json.bill_to_token
      ])
    }
  }

  if (command == 'check') {
    // todo: use the real billing numbers from the spider
    let ok = false
    let user_id = null
    if (json.bill_to_token) {
      const [results] = await connection.query(
        'SELECT id FROM users WHERE access_token = ? and balance > 5',
        [json.bill_to_token]
      )
      if (results.length > 0) {
        user_id = results[0].id
        ok = true
      }
    }
    return NextResponse.json({ ok, user_id })
  }

  connection.end()
  return NextResponse.json({})
}
