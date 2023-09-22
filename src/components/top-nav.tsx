"use client"

import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"

export const TopNav = () => {
  const { authed, logout, user } = useAlby()
  return (
    <>
      {/* {authed && <PusherConnector />} */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            {user ? <UserNav user={user} logout={logout} /> : <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>
    </>
  )
}
