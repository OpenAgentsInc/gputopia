import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const { amount, customer, paymentMethod } = await request.json()

  let paymentIntent = null
  let confirm = null
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      customer,
      payment_method: paymentMethod
    })

    console.log('paymentIntent:', paymentIntent)

    if (paymentIntent.status === 'requires_confirmation') {
      console.log('attempting confirm')
      confirm = await stripe.paymentIntents.confirm(paymentIntent.id, {
        return_url: 'http://localhost:3000/billing'
      })
      console.log('confirm:')
    }
  } catch (error) {
    console.error(`Payment failed: ${error}`)
  }

  if (!paymentIntent) {
    //  || confirm?.status !== 'success'
    return NextResponse.json({ success: false, status: confirm?.status ?? 'Unknown' })
  }

  return NextResponse.json({ success: true, status: confirm?.status ?? 'Unknown' })
}
