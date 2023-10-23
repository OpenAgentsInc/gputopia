'use client'

import { PaymentMethods } from './components/PaymentMethods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { loadStripe } from '@stripe/stripe-js'
// import { CheckoutForm } from './components/CheckoutForm'
// import { PaymentMethods } from './components/PaymentMethods'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function Billing() {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
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
      <div className="mt-20 flex flex-col flex-grow items-center">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Credit</CardTitle>
            <CardDescription>Prepaid account credit</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="-mt-2 text-2xl text-center">$20.47</div>
          </CardContent>
        </Card>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <PaymentMethods />
          </Elements>
        )}
      </div>
    </div>
  )
}
