import * as React from "react"
import { clearChats } from "@/app/actions"
import { ClearHistory } from "./clear-history"
import { Sidebar } from "./sidebar"
import { SidebarFooter } from "./sidebar-footer"
import { SidebarList } from "./sidebar-list"

export const SidebarChat = () => {
  const session = null
  const userId = "1"
  return (
    <Sidebar>
      <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        {/* @ts-ignore */}
        {/* <SidebarList userId={session?.user?.id} /> */}
        <SidebarList userId={userId} />
      </React.Suspense>
      <SidebarFooter>
        {/* <ThemeToggle /> */}
        <ClearHistory clearChats={clearChats} />
      </SidebarFooter>
    </Sidebar>
  )
}
