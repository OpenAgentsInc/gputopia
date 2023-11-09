import { useSession } from 'next-auth/react'
import { useStore } from './store'
import { updateBalances } from './update-balances'

export const withdraw = async (access_token: string) => {
  const balance = useStore.getState().balance

  try {
    const response = await fetch('https://api.getalby.com/invoices', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: balance,
        description: `GPUtopia Withdrawal`
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      if (data.error === true) {
        alert(`Error:` + data.message)
        return
      }
      // console.log(data)

      const payResponse = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, amount: balance })
      })

      const payData = await payResponse.json()
      // console.log(payData)

      updateBalances()
    } else {
      console.error('Error: ', response.statusText)
      return null
    }
  } catch (error) {
    console.error('An error occurred: ', error)
    return null
  }
}

export const withdrawInvoice = async (bolt11: string) => {
  try {
    console.log(bolt11)
    const payResponse = await fetch('/api/pay-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payment_request: bolt11 })
    })

    const payData = await payResponse.json()
    console.log(payData)
    if (payData.ok === false) {
      alert(payData.message)
    }

    updateBalances()
  } catch (error) {
    console.error('An error occurred: ', error)
    return null
  }
}
