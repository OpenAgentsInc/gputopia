import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { grabStripeCustomerId } from '@/lib/grab-stripe-customer-id'
import { auth } from '@/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function GET() {
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
  const paymentMethods = await stripe.customers.listPaymentMethods(customerId)

  return NextResponse.json({ paymentMethods: paymentMethods.data })
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  await stripe.paymentMethods.detach(id)
  return NextResponse.json({ success: true, detached: id })
}
