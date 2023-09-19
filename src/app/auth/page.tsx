"use client"

import { useEffect } from "react"

const tokenEndpoint = "https://api.getalby.com/oauth/token";
const clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET;

export default function Auth() {
  useEffect(() => {
    if (window.location.search) {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");

      if (code) {
        // @ts-ignore
        const payload = new URLSearchParams({
          code_verifier: window.sessionStorage.getItem("code_verifier"),
          grant_type: "authorization_code",
          redirect_uri: process.env.NEXT_PUBLIC_ALBY_CALLBACK_URL,
          code,
        });

        fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          },
          body: payload
        })
          .then(response => response.json())
          .then(data => {
            const {
              access_token,
              expires_in,
              refresh_token,
              scope,
              token_type
            } = data;
            // Get current time in seconds so we can see exactly when the Alby token will expire
            const currentTime = Math.floor(Date.now() / 1000);
            const expires_at = currentTime + expires_in;
            window.sessionStorage.setItem("alby_access_token", access_token);
            window.sessionStorage.setItem("alby_expires_at", expires_at.toString());
            window.sessionStorage.setItem("alby_expires_in", expires_in.toString());
            window.sessionStorage.setItem("alby_refresh_token", refresh_token);
            window.sessionStorage.setItem("alby_scope", scope);
            window.sessionStorage.setItem("alby_token_type", token_type);
            return data
          })
          .then(data => {
            // New API call to save the token
            return fetch("/api/save-token", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token: data.access_token,
                refresh_token: data.refresh_token,
              })
            });
          })
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            window.sessionStorage.setItem("user_id", data.userId.toString());
            window.location.href = `/`;
          })
          .catch((error) => {
            console.log(error);
            alert("Something went wrong. Please try again.")
          })

      }
    }
  }, [])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div id="loader" className="loader"></div>
    </div>
  )
}
