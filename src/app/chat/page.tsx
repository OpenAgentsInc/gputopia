"use client"

import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
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
            {/* <ModeToggle /> */}
            {user ? <UserNav user={user} logout={logout} /> : <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-center">
        <div className="-mt-16 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
