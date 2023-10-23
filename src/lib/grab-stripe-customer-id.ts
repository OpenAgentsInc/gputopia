import Stripe from 'stripe'
import mysql from 'mysql2/promise'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' })

// Get a Stripe customer ID from a user ID.
// First we check the database to see if there's an existing customer ID for the user.
// If not, we create a new customer via Stripe and save the ID to the database.

export async function grabStripeCustomerId(userId: number) {
  console.log('userId:', userId)

  const connection = await mysql.createConnection(process.env.DATABASE_URL as string)

  await connection.beginTransaction()

  // Fetch Stripe customer ID for the given user ID
  const [rows]: any = await connection.execute('SELECT stripe_customer_id FROM users WHERE id = ?', [userId])

  console.log('ROWS:', rows)

  let stripeCustomerId: string

  if (rows.length > 0 && rows[0].stripe_customer_id) {
    stripeCustomerId = rows[0].stripe_customer_id
    console.log('Returning found ', stripeCustomerId)
  } else {
    // Create a new Stripe customer and save the ID in the database
    const customer = await stripe.customers.create({
      /* Additional Stripe options if needed */
    })
    stripeCustomerId = customer.id

    await connection.execute('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [
      stripeCustomerId,
      userId
    ])
    console.log('Updated with', stripeCustomerId)
  }

  // Commit the transaction
  await connection.commit()

  return stripeCustomerId
}
