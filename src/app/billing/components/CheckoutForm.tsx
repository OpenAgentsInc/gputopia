import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

export const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    fetch('/create-checkout-session', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [])

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}
