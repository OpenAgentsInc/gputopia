import axios from 'axios'
import { useEffect, useState } from 'react'

export function usePaymentMethods() {
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
