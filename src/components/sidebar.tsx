'use client'
import * as React from 'react'
import { IconSidebar } from '@/components/ui/icons'
import { Dispatch, SetStateAction } from 'react'
import { SidebarList } from './sidebar-list'
import { Chat } from '@/lib/types'
import { SidebarFooter } from './sidebar-footer'
import { ClearHistory } from './clear-history'
import { clearChats } from '@/app/actions'

export interface SidebarProps {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  chats: Chat[]
}

export function Sidebar({ show, setShow, chats }: SidebarProps) {
  return (
    <div
      className={`border shadow h-[calc(100vh-64px)] border-r relative transition-all ${
        show ? 'w-64 lg:w-96' : 'w-0'
      }`}
    >
      <button className="ml-10 h-9 w-9 p-0 my-4" onClick={() => setShow(!show)}>
        <IconSidebar className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
      <SidebarList chats={chats} />
    </div>
  )
}
