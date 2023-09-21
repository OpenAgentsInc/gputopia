"use client"

import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
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
            <ModeToggle />
            {user ? <UserNav user={user} logout={logout} /> : <Button onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-center">
        <div style={{
          backgroundImage: "url('/images/flares.png')",
          opacity: 0.5,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -1,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          imageRendering: 'optimizeQuality',
          filter: 'blur(0.8px)'
        }}>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white" >Your GPU Marketplace</h1>
          <p className="mt-6 mb-12 text-lg leading-8" style={{ color: "#d3d3d3" }}>The easiest way to buy and sell GPU capacity.</p>
          <a href="/beta" className="tracking-wider font-medium big-green-button rounded-xl px-5 py-4 text-lg text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
            Join the Beta
          </a>
        </div>
      </div>
    </div>
  )
}
