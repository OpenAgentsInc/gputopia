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

  // Assuming the frontend sends the amount in the request body.
  // You should validate the amount here to make sure it's not too high or too low.
  const { amount } = await request.json()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in smallest currency unit (e.g., cents for USD)
    currency: 'usd' // adjust to your desired currency
    // add any other desired parameters here, like metadata, customer ID, etc.
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
