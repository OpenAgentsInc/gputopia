"use client"

interface WebLN {
  // todo
}

declare global {
  interface Window {
    webln: WebLN;
  }
}

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Home() {

  useEffect(() => {
    if (typeof window.webln !== 'undefined') {
      console.log('WebLN is available!');
    }
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>Click me</Button>
    </main>
  )
}
