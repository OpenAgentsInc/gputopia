import { NextResponse } from 'next/server'
import mysql from 'mysql2'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET() {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const email = session?.user.email

  const connection = mysql.createConnection(process.env.DATABASE_URL as string)

  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT balance,total_sats_earned FROM users WHERE email = ?',
      [email],
      function (err, results: any) {
        connection.end()

        if (err) {
          resolve(NextResponse.json({ error: 'Database error' }))
          return
        }

        console.log(results)

        resolve(
          NextResponse.json({
            balance: results[0].balance ?? null,
            totalSatsEarned: results[0].total_sats_earned ?? null
          })
        )
      }
    )
  })
}
