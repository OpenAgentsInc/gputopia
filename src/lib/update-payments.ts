import { useStore } from "./store"

export const updatePayments = () => {
  const user = useStore.getState().user
  if (!user) {
    alert("Log in again")
    return console.log("No user found")
  }

  fetch("/api/payment-history", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => {
      // console.log(data)
      useStore.setState({ payments: json.payments })
    }).catch((error) => {
      console.log(error);
    })
}
