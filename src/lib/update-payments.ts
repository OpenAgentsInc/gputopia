import { useStore } from "./store"

export const updatePayments = () => {
  const user = useStore.getState().user
  if (!user) return console.log("No user found")

  fetch("/api/payment-history", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
  }).then((json) => {
    if (json.payments) {
      useStore.setState({ payments: json.payments })
    }
  }).catch((error) => {
    console.log(error);
  })
}
