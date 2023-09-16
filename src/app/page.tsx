"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"

export default function Home() {
  const { authed } = useAlby()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row justify-center space-x-6">
        {authed ? (
          <Button >Welcome</Button>
        ) : <Button onClick={startAlbyOauth}>Log in with Alby</Button>}
        <ModeToggle />
      </div>
    </main>
  )
}
