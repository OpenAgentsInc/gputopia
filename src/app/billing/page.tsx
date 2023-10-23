'use client'

import { PaymentMethods } from './components/PaymentMethods'

import { loadStripe } from '@stripe/stripe-js'
// import { CheckoutForm } from './components/CheckoutForm'
// import { PaymentMethods } from './components/PaymentMethods'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RocketIcon } from '@radix-ui/react-icons'
import { BackgroundImage } from '@/components/background-image'
import { AccountCredit } from './components/AccountCredit'
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
      <div className="mt-24 flex flex-col flex-grow items-center">
        <BackgroundImage />

        {/* <div className="w-96">
          <Alert>
            <RocketIcon className="h-8 w-8" />
            <AlertTitle className="ml-4 text-lg">Demo only</AlertTitle>
            <AlertDescription className="ml-4 text-muted-foreground">
              We are testing with fake data
            </AlertDescription>
          </Alert>
        </div> */}

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <AccountCredit />
            <PaymentMethods />
          </Elements>
        )}
      </div>
    </div>
  )
}
