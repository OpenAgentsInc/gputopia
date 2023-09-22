import { useEffect } from "react"
import { useStore } from "./store"

export function useBalance() {
  const balance = useStore((state) => state.balance)
  const user = useStore((state) => state.user)
  useEffect(() => {
    if (!user || balance > 0) return

    fetch("/api/balance", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((json) => {
      if (json.totalSatsEarned) {
        useStore.setState({ balance: json.balance, totalSatsEarned: json.totalSatsEarned })
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [user?.email, balance])
  return balance
}
