import { auth } from '@/auth'
import { grabStripeCustomerId } from '@/lib/grab-stripe-customer-id'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function POST() {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }
  const userId = session.user.user_id
  // if userId is not a number, return error
  if (typeof userId !== 'number') {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const customerId = await grabStripeCustomerId()
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId
  })

  return NextResponse.json({ clientSecret: setupIntent.client_secret })
}
