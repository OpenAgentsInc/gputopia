'use client'
import { Message, useChat } from 'ai/react'
import { toast } from 'react-hot-toast'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { SidebarChat } from './sidebar-chat'
import { ChatScrollAnchor } from './chat-scroll-anchor'
import { ChatPanel } from './chat-panel'
import { PreviewToken } from './preview-token'
import { ChatList } from './chat-list'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { Chat as IChat } from '../../../lib/types'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const chats = useStore(state => state.chats)
  const addChat = useStore(state => state.addChat)
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)

  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    }
  })

  useEffect(() => {
    if (!isLoading && messages && messages[0] && messages[0].id && messages[1]) {
      if (!chats.some(c => c.id === messages[0].id)) {
        const newChat: IChat = {
          path: '/chat/' + messages[0].id,
          messages: messages,
          id: messages[0].id,
          title: messages[0].content as string,
          userId: '',
          createdAt: messages[0].createdAt as Date
        }
        addChat(newChat)
      }
    }
  }, [addChat, chats, isLoading, messages])

  return (
    <>
      <div className="mt-16 flex flex-row justify-center">
        <SidebarChat />

        <div className="justify-center self-center content-center center pl-[2rem] z-1 relative w-full ">
          <div className={cn('pt-4 md:pt-10 mt-16 pb-40', className)}>
            {messages.length ? (
              <>
                <ChatList messages={messages} />
                <ChatScrollAnchor trackVisibility={isLoading} />
              </>
            ) : (
              <EmptyScreen />
            )}
          </div>

          <ChatPanel
            id={id}
            isLoading={isLoading}
            stop={stop}
            append={append}
            reload={reload}
            messages={messages}
            input={input}
            setInput={setInput}
          />

          <PreviewToken />
        </div>
      </div>
    </>
  )
}
