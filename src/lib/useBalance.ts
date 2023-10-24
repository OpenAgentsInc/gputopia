import { useEffect } from 'react'
import { useStore } from './store'
import { useSession } from 'next-auth/react'

export function useBalance() {
  const balance = useStore(state => state.balance)
  // const user = useStore(state => state.user)
  const { status } = useSession()
  useEffect(() => {
    if (status !== 'authenticated' || balance > 0) return

    fetch('/api/balance')
      .then(res => res.json())
      .then(json => {
        if (json.totalSatsEarned || json.totalSatsEarned === 0) {
          useStore.setState({
            balance: json.balance,
            balanceUsd: json.balanceCents,
            totalSatsEarned: json.totalSatsEarned
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [status])
  return balance
}
