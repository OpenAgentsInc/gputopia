'use client'

import { PaymentMethods } from './components/PaymentMethods'

// import { loadStripe } from '@stripe/stripe-js'
// import { CheckoutForm } from './components/CheckoutForm'
// import { PaymentMethods } from './components/PaymentMethods'
// import { Elements } from '@stripe/react-stripe-js'
// import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function Billing() {
  // const [clientSecret, setClientSecret] = useState('')

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch('/api/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ amount: 515 })
  //   })
  //     .then(res => res.json())
  //     .then(data => setClientSecret(data.clientSecret))
  // }, [])

  // const appearance = {
  //   theme: 'night' as const
  // }
  // const options = {
  //   clientSecret,
  //   appearance
  // }
  return (
    <div className="flex flex-col h-screen">
      <div className="mt-24 flex flex-col flex-grow items-center">
        <div className="border bg-card p-4 rounded-lg text-white flex justify-between items-center">
          <div>
            <div className="text-muted-foreground text-xl">Credit</div>
            <div className="text-2xl mt-2">$20.47</div>
          </div>
        </div>
        <PaymentMethods />
      </div>
    </div>
  )
}
