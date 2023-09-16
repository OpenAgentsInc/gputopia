import { useEffect, useState } from "react"

export function useAlby () {
  const [authed, setAuthed] = useState(false)
  useEffect(() => {
    const accessToken = window.sessionStorage.getItem("alby_access_token");
    const expiresAt = parseInt(window.sessionStorage.getItem("alby_expires_at") || '0', 10);
    const expiresIn = parseInt(window.sessionStorage.getItem("alby_expires_in") || '0', 10);
    const refreshToken = window.sessionStorage.getItem("alby_refresh_token");
    const scope = window.sessionStorage.getItem("alby_scope");
    const tokenType = window.sessionStorage.getItem("alby_token_type");

    if (accessToken && expiresAt && expiresIn && refreshToken && scope && tokenType) {
      setAuthed(true);
    }
  }, [])
  return { authed };
}
