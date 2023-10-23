import axios from 'axios'
import { useEffect, useState } from 'react'
import stripe from 'stripe'

interface PaymentMethodsResponse {
  paymentMethods: stripe.PaymentMethod[]
  fetchData: () => void
}

export function usePaymentMethods(): PaymentMethodsResponse {
  const [paymentMethods, setPaymentMethods] = useState([])

  const fetchData = async () => {
    const response = await axios.get('/api/payment-methods')
    setPaymentMethods(response.data.paymentMethods)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { paymentMethods, fetchData }
}
