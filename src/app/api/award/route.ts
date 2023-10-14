import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { pusher } from '@/lib/pusher'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const rewardAmount = searchParams.get('rewardAmount')

  if (key !== process.env.AWARD_KEY) {
    return new Response(null, {
      status: 403,
      statusText: 'Access denied'
    })
  }

  if (!rewardAmount || isNaN(Number(rewardAmount))) {
    return new Response(null, {
      status: 400,
      statusText: 'Invalid reward amount'
    })
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

  try {
    let userIdsArray: string[] = []
    // Grab a list of userIds in the Pusher channel `presence-serving-vicuna`
    const pusherRes = await pusher.get({
      path: '/channels/presence-serving-vicuna/users'
    })
    const resJson = await pusherRes.json()
    userIdsArray = resJson.users.map((user: { id: string }) => user.id)

    // Update balance for all users in the list
    const query = `UPDATE users SET balance = balance + ?, total_sats_earned = total_sats_earned + ? WHERE id IN (?)`
    await connection.query(query, [Number(rewardAmount), Number(rewardAmount), userIdsArray])
    console.log(`awardroute: Updated balance for ${userIdsArray.length} users`)
  } catch (err) {
    console.log('awardroute: Error fetching users:', err)
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  } finally {
    connection.end()
  }

  return NextResponse.json({ result: 'Success' })
}
