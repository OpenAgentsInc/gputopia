import { useStore } from './store'

export const updatePayments = () => {
  const user = useStore.getState().user
  if (!user) return console.log('No user found')

  fetch('/api/payment-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.payments) {
        useStore.setState({ payments: data.payments })
      }
    })
    .catch(error => {
      console.log(error)
    })
}
