"use client"

import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { ChatWorkspace } from "@/components/widgets/chat-workspace"
import { PaymentHistory } from "@/components/widgets/payment-history"
import { Stats } from "@/components/widgets/stats"
import { Trollbox } from "@/components/widgets/trollbox"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"

export default function Home() {
  const { authed, logout, user } = useAlby()
  return (
    <div className="flex flex-col h-screen">
      {authed && <PusherConnector />}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            {user ? <UserNav user={user} logout={logout} /> : <Button onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {authed && (
          <div className="mx-8 mb-4 flex flex-col flex-grow">
            <Stats />
            <div className="mx-8 flex-grow grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-1" />
              <PaymentHistory />
              <div className="col-span-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
