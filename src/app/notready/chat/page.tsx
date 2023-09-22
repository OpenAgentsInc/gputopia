"use client"

import { PanelLeftIcon } from "@/components/icons/panel-left"
import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { UserNav } from "@/components/user-nav"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"

export default function Home() {
  const { authed, logout, user } = useAlby()
  return (
    <div className="flex flex-col h-screen">
      {authed && <PusherConnector />}
      <div className="border-b relative">
        <div className="flex flex-row h-16 items-center px-4 justify-between">
          <MainNav className="mx-6" />

          <div className="absolute left-1/2 transform -translate-x-1/2">

          </div>

          <div className="ml-auto flex items-center space-x-4">
            {user ? <UserNav user={user} logout={logout} /> : <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>

      <Sheet>
        <div className="flex flex-row items-center mt-4 justify-between">
          <SheetTrigger className="ml-8">
            <PanelLeftIcon />
          </SheetTrigger>
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Vicuna 7B</TabsTrigger>
              <TabsTrigger value="password">34B Instruct</TabsTrigger>
              <TabsTrigger value="wizard">Wizard</TabsTrigger>
            </TabsList>
          </Tabs>
          <div></div>
        </div>

        <SheetContent side="left">
          <div className="w-full flex justify-center items-center">
            <Button variant="outline" size="lg" className="w-[75%]">New Chat</Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* <Separator className="mt-4" /> */}
    </div>
  )
}
