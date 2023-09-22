
import axios from "axios"
import { useEffect, useState } from "react"
import { useStore } from "./store"

export interface AlbyUser {
  avatar: string | null;
  email: string;
  identifier: string;
  keysend_custom_key: string
  keysend_custom_value: string
  keysend_pubkey: string
  lightning_address: string
  name: string | null
}

const refreshWhenSecondsLessThan = 3700


const wipeTokens = () => {
  window.sessionStorage.removeItem("alby_access_token");
  window.sessionStorage.removeItem("alby_expires_at");
  window.sessionStorage.removeItem("alby_expires_in");
  window.sessionStorage.removeItem("alby_refresh_token");
  window.sessionStorage.removeItem("alby_scope");
  window.sessionStorage.removeItem("alby_token_type");
};

export function useAlby() {
  const [accessToken, setAccessToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState<AlbyUser | null>(null)
  const [expiresAt, setExpiresAt] = useState(0)
  const [refreshing, setRefreshing] = useState(false);

  const logout = () => {
    wipeTokens()
    setAuthed(false)
    setUser(null)
  }

  const refreshAccessToken = async () => {
    console.log("Attempting to refresh Alby access token");
    const clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error('Missing client ID or secret');
    try {
      const response = await axios.post('https://api.getalby.com/oauth/token', {
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }, {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      // console.log("Refresh token response:", response.data);

      const { access_token, expires_in, refresh_token, scope, token_type } = response.data;
      const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresAt(expiresAt);

      // Save new token data to session storage
      window.sessionStorage.setItem("alby_access_token", access_token);
      window.sessionStorage.setItem("alby_expires_at", expiresAt.toString());
      window.sessionStorage.setItem("alby_expires_in", expires_in.toString());
      window.sessionStorage.setItem("alby_refresh_token", refresh_token);
      window.sessionStorage.setItem("alby_scope", scope);
      window.sessionStorage.setItem("alby_token_type", token_type);

      console.log("Updated access token successfully")

      // Calculate remainingSeconds here and decide whether to continue refreshing
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingSeconds = expiresAt - currentTime;
      if (remainingSeconds > refreshWhenSecondsLessThan) {
        setRefreshing(false);  // Turn off refreshing if there's ample time before token expires
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  };

  useEffect(() => {
    if (expiresAt === 0 || refreshing) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = expiresAt - currentTime;

    // if (remainingSeconds <= refreshWhenSecondsLessThan) {
    //   console.log("Refreshing token.")
    //   setRefreshing(true);
    //   refreshAccessToken().finally(() => setRefreshing(false));
    //   return;
    // }

    // const timerId = setTimeout(() => {
    //   setRefreshing(true);
    //   refreshAccessToken().finally(() => setRefreshing(false));
    // }, (remainingSeconds - refreshWhenSecondsLessThan) * 1000);

    const timerId = setTimeout(() => {
      setRefreshing(true);
      refreshAccessToken()
        .then(() => {
          setRefreshing(false);
        })
        .catch((err) => {
          console.error("Failed to refresh token:", err);
          setRefreshing(false);
        });
    }, (remainingSeconds - refreshWhenSecondsLessThan) * 1000);

    return () => clearTimeout(timerId);
  }, [expiresAt, refreshing]);

  // Ensure we have all valid Alby token data in session storage
  useEffect(() => {
    const accessToken = window.sessionStorage.getItem("alby_access_token");
    const expiresAt = parseInt(window.sessionStorage.getItem("alby_expires_at") || '0', 10);
    const expiresIn = parseInt(window.sessionStorage.getItem("alby_expires_in") || '0', 10);
    const refreshToken = window.sessionStorage.getItem("alby_refresh_token");
    const scope = window.sessionStorage.getItem("alby_scope");
    const tokenType = window.sessionStorage.getItem("alby_token_type");

    if (accessToken && expiresAt && expiresIn && refreshToken && scope && tokenType) {
      setAuthed(true);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setExpiresAt(expiresAt);
    }
  }, [])

  // Grab user data from Alby
  useEffect(() => {
    if (authed && !user && !!accessToken) {
      fetch("https://api.getalby.com/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
          useStore.setState({ user: res })
        })
        .catch((err) => {
          logout()
          console.error(err);
        })
    }
  }, [authed, user, accessToken])

  return { authed, logout, user };
}
