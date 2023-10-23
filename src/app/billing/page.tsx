'use client'

import { loadStripe } from '@stripe/stripe-js'
import { CheckoutForm } from './components/CheckoutForm'
import { PaymentMethods } from './components/PaymentMethods'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

export default function Billing() {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 515 })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [])

  const appearance = {
    theme: 'night' as const
  }
  const options = {
    clientSecret,
    appearance
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-grow justify-center items-center">
        {/* <PaymentMethods /> */}
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  )
}
