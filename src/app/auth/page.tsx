"use client"

import { useEffect } from "react"
import { ModeToggle } from "@/components/ui/mode-toggle"

const tokenEndpoint = "https://api.getalby.com/oauth/token";
const clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET;

export default function Auth() {
  useEffect(() => {
    if (window.location.search) {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");

      console.log(window.sessionStorage.getItem("code_verifier"))

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
            console.log(data)
          });
      }
    }
  }, [])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div id="loader" className="loadergreen"></div>
    </div>
  )
}
