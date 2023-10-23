import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const setupIntent = await stripe.setupIntents.create()

  console.log('setupIntent:', setupIntent)
  console.log('Returning client secret', setupIntent.client_secret)

  return NextResponse.json({ clientSecret: setupIntent.client_secret })
}
