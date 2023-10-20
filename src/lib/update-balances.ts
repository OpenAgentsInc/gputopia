import { useStore } from './store'
import { updatePayments } from './update-payments'

export const updateBalances = () => {
  const user = useStore.getState().user
  if (!user) return console.log('No user found')

  fetch('/api/balance')
    .then(res => res.json())
    .then(data => {
      if (data.totalSatsEarned || data.totalSatsEarned === 0) {
        useStore.setState({ balance: data.balance, totalSatsEarned: data.totalSatsEarned })
        console.log(`Updated balance to ${data.balance} and totalSatsEarned to ${data.totalSatsEarned}`)
        updatePayments()
      }
    })
    .catch(error => {
      console.log(error)
    })
}
