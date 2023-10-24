import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import mysql from 'mysql2/promise'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
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

    if (paymentIntent.status === 'requires_confirmation') {
      console.log('attempting confirm')
      confirm = await stripe.paymentIntents.confirm(paymentIntent.id, {
        return_url: 'http://localhost:3000/billing'
      })
    }
  } catch (error) {
    console.error(`Payment failed: ${error}`)
  }

  if (!paymentIntent || !confirm || confirm?.status !== 'succeeded') {
    return NextResponse.json({ success: false, status: confirm?.status ?? 'Unknown' })
  }

  // Charge succeeded, credit the user's account.
  const incrementValue = amount * 100

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

  await connection.beginTransaction()

  await connection.execute('UPDATE users SET balance_cents = balance_cents + ? WHERE id = ?', [
    incrementValue,
    userId
  ])

  // Commit the transaction
  await connection.commit()

  return NextResponse.json({ success: true, status: confirm?.status ?? 'Unknown' })
}
