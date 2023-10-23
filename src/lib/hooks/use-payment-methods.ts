import axios from 'axios'
import { useEffect, useState } from 'react'
import stripe from 'stripe'

export function usePaymentMethods(): stripe.PaymentMethod[] {
  const [paymentMethods, setPaymentMethods] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/payment-methods')
      setPaymentMethods(response.data.paymentMethods)
    }

    fetchData()
  }, [])

  return paymentMethods
}
