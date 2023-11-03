import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2'
import crypto from 'crypto'
import { auth } from '@/auth'

function generateRandomHex(n: number) {
  const randomValues = crypto.randomBytes(n)
  return randomValues.toString('hex')
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const userId = session?.user.user_id

  const connection = mysql.createConnection(process.env.DATABASE_URL as string)
  return new Promise((resolve, reject) => {
    connection.query('SELECT access_token FROM users WHERE id = ?', [userId], function (err, results) {
      connection.end()
      if (err) {
        resolve(NextResponse.json({ error: 'Database error' }))
        return
      }
      resolve(
        NextResponse.json({
          token: results[0].access_token
        })
      )
    })
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const userId = session?.user.user_id

  const json = await request.json()
  const connection = mysql.createConnection(process.env.DATABASE_URL as string)
  const accessToken = generateRandomHex(16)
  if (json.command == 'generate') {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET access_token = ? WHERE id = ?',
        [accessToken, userId],
        function (err, results) {
          connection.end()

          if (err) {
            resolve(NextResponse.json({ error: 'Database error' }))
            return
          }

          resolve(
            NextResponse.json({
              token: accessToken
            })
          )
        }
      )
    })
  }
}
