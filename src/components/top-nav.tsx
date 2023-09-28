"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"
import { OnlineUsers } from "./online-users"
import { SatsBalance } from "./sats-balance"
import { ModeToggle } from "./ui/mode-toggle"

export const TopNav = () => {
  const { authed, logout, user } = useAlby()
  const pathname = usePathname()
  return (
    <>
      {authed && <PusherConnector />}
      <div className="border-b fixed top-0 left-0 right-0 z-50 backdrop-blur bg-background/80">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          {/* <ModeToggle /> */}
          <div className="ml-auto flex items-center space-x-4">
            {authed && <OnlineUsers />}
            {authed && <SatsBalance />}
            {pathname !== '/auth' && (
              <>
                {user ? <UserNav user={user} logout={logout} /> : <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
