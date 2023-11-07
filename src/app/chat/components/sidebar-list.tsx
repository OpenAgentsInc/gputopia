'use client'

import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarItem } from '@/app/chat/components/sidebar-item'
import { SidebarActions } from './sidebar-actions'
import { useEffect, useState } from 'react'
import type { Chat } from '@/lib/types'
import { useStore } from '@/lib/store'

export interface SidebarListProps {
  userId?: string
}

export function SidebarList({ userId }: SidebarListProps) {
  const chats = useStore(state => state.chats)

  useEffect(() => {
    async function initialData() {
      const chats = await getChats(userId)
      useStore.setState({ chats: chats })
    }

    initialData()
  }, [userId])

  return (
    <div className="scrollbar-thin flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-hidden hover:overflow-y-auto z-40">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            chat =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions chat={chat} removeChat={removeChat} shareChat={shareChat} />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
