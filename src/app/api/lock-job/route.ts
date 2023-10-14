import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  //@ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { jobId, updated } = json

  const userId = session.user.user_id

  if (updated !== true) {
    console.log(`Forcing update for user ${userId} on job ${jobId}`)
    throw new Error('Outdated client code, please refresh')
  } else {
    console.log('Update is true, continuing...')
  }

  const lockKey = `lock:${jobId}`
  console.log(`Attempting to lock job ${jobId}`)

  // Try to acquire lock
  const lockSet = await kv.setnx(lockKey, 'locked')

  try {
    if (lockSet === 1) {
      // Lock acquired
      console.log(`"WON JOB: user ${userId} locked job ${jobId}`)
    } else {
      console.log(`"LOST JOB: user ${userId} lost out on job ${jobId}`)
    }
  } catch (e) {
    console.log('Error locking job')
  }

  return NextResponse.json({ lockSet })
}
