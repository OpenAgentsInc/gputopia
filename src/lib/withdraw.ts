import { useStore } from "./store"

export const withdraw = async () => {

  const accessToken = window.sessionStorage.getItem("alby_access_token");
  const balance = useStore.getState().balance

  try {
    const response = await fetch('https://api.getalby.com/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "amount": balance,
        "description": `GPUtopia Withdrawal`
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data)
    } else {
      console.error("Error: ", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return null;
  }
}
