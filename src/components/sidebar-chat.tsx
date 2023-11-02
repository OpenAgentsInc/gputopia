import * as React from 'react'
import { clearChats } from '@/app/actions'
import { ClearHistory } from './clear-history'
import { Sidebar } from './sidebar'
import { SidebarFooter } from './sidebar-footer'
import { SidebarList } from './sidebar-list'
import { auth } from '@/auth'

export const SidebarChat = async () => {
  const session = await auth()

  return (
    <Sidebar>
      <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        <SidebarList userId={session?.user?.user_id} />
      </React.Suspense>
      <SidebarFooter>
        <ClearHistory clearChats={clearChats} />
      </SidebarFooter>
    </Sidebar>
  )
}
