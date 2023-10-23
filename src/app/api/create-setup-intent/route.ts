import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function POST() {
  // const session = await auth()
  // if (!session) {
  //   return new NextResponse('Unauthorized', {
  //     status: 401
  //   })
  // }

  const setupIntent = await stripe.setupIntents.create({
    customer: 'cus_OsDSwjUXTQPa2l'
  })

  return NextResponse.json({ clientSecret: setupIntent.client_secret })
}
