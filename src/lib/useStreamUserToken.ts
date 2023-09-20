import { useEffect, useState } from "react"

export function useStreamUserToken() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    fetch("/api/stream-token", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((json) => {
      if (json.token) {
        console.log("Setting token", json.token)
        setToken(json.token)
        setUserId(String(json.userId))
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return { token, userId }
}
