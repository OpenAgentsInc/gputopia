import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { pusher } from '@/lib/pusher'
import { useSession } from 'next-auth/react'
import { cp } from 'fs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  try {
    const formDataText = await request.text()
    const formData = new URLSearchParams(formDataText)
    const socket_id = formData.get('socket_id') as string
    const channel_name = formData.get('channel_name') as string

    const accessToken = session?.access_token

    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'No access token found' })
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL as string)
    const [results] = await connection.query('SELECT user_id FROM access_tokens WHERE token = ?', [
      accessToken.value
    ])

    if (results.length === 0) {
      connection.end()
      return NextResponse.json({ ok: false, error: 'Invalid token' })
    }

    const userId = results[0].user_id
    const [userResults] = await connection.query('SELECT * FROM users WHERE id = ?', [userId])

    connection.end()

    if (userResults.length === 0) {
      return NextResponse.json({ ok: false, error: 'User not found' })
    }

    const userInfo = userResults[0]

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: userInfo.id.toString(),
      user_info: {
        name: userInfo.name
        // add more user_info as needed
      }
    })

    return NextResponse.json({
      auth: authResponse.auth,
      channel_data: authResponse.channel_data
    })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ ok: false, error: 'Internal Server Error' })
  }
}
