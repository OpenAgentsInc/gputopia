"use client"

interface WebLN {
  // todo
  enable: () => Promise<void>;
}

declare global {
  interface Window {
    webln: WebLN;
  }
}

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function Home() {

  useEffect(() => {
    if (typeof window.webln !== 'undefined') {
      console.log('WebLN is available!');
    }
  }, [])

  const connect = async () => {
    try {
      await window.webln.enable();
      console.log("Connected via WebLN")
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row justify-center space-x-6">
        <Button onClick={connect}>Connect via WebLN</Button>
        <ModeToggle />
      </div>
    </main>
  )
}
