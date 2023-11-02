'use client'

import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarItem } from '@/app/chat/components/sidebar-item'
import { SidebarActions } from './sidebar-actions'
import { useEffect, useState } from 'react'
import type { Chat } from '@/lib/types'

export interface SidebarListProps {
  userId?: string
}

export function SidebarList({ userId }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    async function initialData() {
      const chats = await getChats(userId)
      setChats(chats)
    }

    initialData()
  }, [userId])

  return (
    <div className="flex-1 overflow-auto">
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
