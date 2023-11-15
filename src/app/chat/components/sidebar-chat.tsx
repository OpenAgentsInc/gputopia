import * as React from 'react'
import { clearChats } from '@/app/actions'
import { ClearHistory } from './clear-history'
import { Sidebar } from './sidebar'
import { SidebarFooter } from './sidebar-footer'
import { SidebarList } from './sidebar-list'
import { Button } from '@/components/ui/button'
import { IconPlus, IconSidebar } from '@/components/ui/icons'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BreakPointHooks, breakpointsTailwind } from '@react-hooks-library/core'
import { useEffect } from 'react'
const { useGreater } = BreakPointHooks(breakpointsTailwind)

export const SidebarChat = () => {
  const { data: session } = useSession()
  const userId = session?.user.id

  const bigScreen = useGreater('lg')
  const [showSidebar, setShowSidebar] = React.useState(true)

  useEffect(
    function () {
      setShowSidebar(bigScreen)
    },
    [bigScreen]
  )

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <>
      <div
        className={`z-20 relative transition-all duration-300 ease-in-out ${
          showSidebar ? 'basis-[20rem] grow-0 shrink-0' : 'basis-[4rem]'
        }`}
      >
        <div
          className={`flex h-full min-h-0 w-auto transition-all duration-300 ease-in-out ${
            showSidebar ? 'opacity-100 w-[27rem]' : 'opacity-100 pointer-events-none w-0'
          } `}
        >
          <div
            className={`mt-16 fixed top-0 left-0 w-[20rem] h-full bg-backgroung border-r-[1px] border-gray-600 transform
            transition-transform duration-300 ease-in-out ${
              showSidebar ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-4 flex flex-col h-full w-full scroll ">
              <div className="mb-1 flex flex-row gap-2">
                <Link href="/chat" prefetch={false} className="w-[15rem] overflow-hidden">
                  <span className="flex px-3 min-h-[44px] items-center gap-3 text-[15px] rounded-md border">
                    <IconPlus className="h-5 w-5" />
                    New Chat
                  </span>
                </Link>
              </div>
              <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
                <SidebarList userId={userId} />
              </React.Suspense>
              <SidebarFooter>
                <ClearHistory clearChats={clearChats} />
              </SidebarFooter>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 h-9 w-9 p-0 flex px-2 min-h-[44px] items-center gap-3 cursor-pointer rounded-md border"
          onClick={toggleSidebar}
        >
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </>
  )
}
