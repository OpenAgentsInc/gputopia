import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { fetchUserFromAlby } from '@/lib/alby'

export async function POST(request: NextRequest) {
  let userId
  try {
    const body = await request.json()
    const { token, refresh_token } = body

    if (!token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'Missing token or refresh_token' })
    }

    const albyUser = await fetchUserFromAlby(token)
    if (!albyUser) {
      throw new Error('Error fetching user')
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

    const [results] = await connection.execute('SELECT * FROM users WHERE alby_id = ?', [
      albyUser.alby_id
    ])

    if (results.length > 0) {
      userId = results[0].id
      await connection.execute(
        'INSERT INTO access_tokens (user_id, token, refresh_token, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [userId, token, refresh_token]
      )
    } else {
      await connection.execute(
        'INSERT INTO users (alby_id, name, email, avatar, lightning_address, keysend_pubkey, keysend_custom_key, keysend_custom_value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          albyUser.alby_id,
          albyUser.name,
          albyUser.email,
          albyUser.avatar,
          albyUser.lightning_address,
          albyUser.keysend_pubkey,
          albyUser.keysend_custom_key,
          albyUser.keysend_custom_value
        ]
      )

      const [insertResults] = await connection.execute('SELECT LAST_INSERT_ID() as id')
      userId = insertResults[0].id

      await connection.execute(
        'INSERT INTO access_tokens (user_id, token, refresh_token, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [userId, token, refresh_token]
      )
    }

    connection.end()
    const response = NextResponse.json({ ok: true, userId })

    return response
  } catch (err) {
    console.error('Error saving token:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' })
  }
}
