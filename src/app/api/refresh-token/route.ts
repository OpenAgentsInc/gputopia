import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { formatTimestampForSQLInsert, getUtcDate } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const ONE_MINUTE = 1 * 60 * 1000
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL as string,
    timezone: '+00:00'
  })

  let token = null

  try {
    const body = await request.json()
    const { user_id, refresh_token } = body

    await connection.beginTransaction()

    // Select with a lock
    const [results] = await connection.execute('SELECT * FROM access_tokens WHERE user_id = ? FOR UPDATE', [
      user_id
    ])

    if (results.length > 0) {
      const dbEntry = results[0]
      const updatedAt = getUtcDate(dbEntry.updated_at)

      const maxDate = Date.now() - ONE_MINUTE
      if (updatedAt < maxDate) {
        const response = await callAlbyRefreshToken(refresh_token as string)

        token = await response.json()
        if (!response.ok) throw token

        const expiresAt = Math.floor(Date.now() + token.expires_in * 1000)
        token.expires_at = expiresAt

        await connection.execute(
          'UPDATE access_tokens SET token = ?, refresh_token = ?, expires_at = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?',
          [token.access_token, token.refresh_token, formatTimestampForSQLInsert(expiresAt), user_id]
        )
      } else {
        token = {
          access_token: dbEntry.token,
          expires_at: new Date(dbEntry.expires_at).getTime(),
          refresh_token: dbEntry.refresh_token
        }
      }
    }
    await connection.commit()
  } catch (error) {
    console.log('Refresh token Error', error)
    await connection.rollback()
    throw error
  } finally {
    connection.end()

    const response = NextResponse.json(token)

    return response
  }
}

async function callAlbyRefreshToken(newRefreshToken: string) {
  const clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID as string
  const clientSecret = process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET as string
  const refreshToken = newRefreshToken

  const basicAuth = `Basic ${btoa(`${clientId}:${clientSecret}`)}`

  const formData = new FormData()
  formData.append('refresh_token', refreshToken)
  formData.append('grant_type', 'refresh_token')

  const response = await fetch('https://api.getalby.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: basicAuth
    },
    body: formData
  })

  return response
}
