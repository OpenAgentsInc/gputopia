import { useEffect } from 'react'
import { useStore } from './store'

export function useBalance() {
  const balance = useStore(state => state.balance)
  const user = useStore(state => state.user)
  useEffect(() => {
    if (!user || balance > 0) return

    fetch('/api/balance')
      .then(res => res.json())
      .then(json => {
        if (json.totalSatsEarned || json.totalSatsEarned === 0) {
          useStore.setState({ balance: json.balance, totalSatsEarned: json.totalSatsEarned })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [user?.email, balance, user])
  return balance
}
