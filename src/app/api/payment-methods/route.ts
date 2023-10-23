import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function GET() {
  const customerId = 'cus_OsDSwjUXTQPa2l'

  const paymentMethods = await stripe.customers.listPaymentMethods(customerId, { type: 'card' })

  console.log('paymentMethods:', paymentMethods)

  return NextResponse.json({ paymentMethods: paymentMethods.data })
}
