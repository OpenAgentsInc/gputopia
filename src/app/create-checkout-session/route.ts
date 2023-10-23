import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc', { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return new NextResponse('Unauthorized', {
      status: 401
    })
  }

  const stripeSession = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1
      }
    ],
    mode: 'payment',
    return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`
  })

  console.log('Returning client secret', stripeSession.client_secret)

  NextResponse.json({ clientSecret: stripeSession.client_secret })
}
