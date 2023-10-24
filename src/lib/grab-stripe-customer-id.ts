import Stripe from 'stripe'
import mysql from 'mysql2/promise'
import { auth } from '@/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

// Get a Stripe customer ID from a user ID.
// First we check the database to see if there's an existing customer ID for the user.
// If not, we create a new customer via Stripe and save the ID to the database.

export async function grabStripeCustomerId() {
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.user_id
  // if userId is not a number, return error
  if (typeof userId !== 'number') {
    throw new Error('Unauthorized')
  }
  // console.log(session)

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string)
  await connection.beginTransaction()

  // Fetch Stripe customer ID for the given user ID
  const [rows]: any = await connection.execute('SELECT stripe_customer_id FROM users WHERE id = ?', [userId])

  let stripeCustomerId: string

  if (rows.length > 0 && rows[0].stripe_customer_id) {
    stripeCustomerId = rows[0].stripe_customer_id
  } else {
    // Create a new Stripe customer and save the ID in the database
    const customer = await stripe.customers.create({
      name: session.user.name ?? `Alby User ${session.user.alby_id}`,
      email: session.user.email ?? undefined
      /* Additional Stripe options if needed */
    })
    stripeCustomerId = customer.id

    await connection.execute('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [
      stripeCustomerId,
      userId
    ])
  }

  // Commit the transaction
  await connection.commit()

  return stripeCustomerId
}
