'use client'
import { Message, useChat } from 'ai/react'
import { toast } from 'react-hot-toast'
import { EmptyScreen } from '@/app/chat/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { SidebarChat } from './sidebar-chat'
import { ChatScrollAnchor } from './chat-scroll-anchor'
import { ChatPanel } from './chat-panel'
import { PreviewToken } from './preview-token'
import { ChatList } from '@/components/chat-list'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Chat as IChat } from '../../../lib/types'
import React from 'react'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const chats = useStore(state => state.chats)
  const selectedModel = useStore(state => state.selectedModel)
  const addChat = useStore(state => state.addChat)
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)

  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken,
      selectedModel: selectedModel.name
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
        let createdAd = 0
        if (messages[1].createdAt) {
          createdAd = messages[1].createdAt.getTime()
        }

        const newChat: IChat = {
          path: '/chat/' + messages[0].id,
          messages: messages,
          id: messages[0].id,
          title: messages[0].content as string,
          userId: '',
          createdAt: createdAd
        }
        addChat(newChat)
      }
    }
  }, [addChat, chats, isLoading, messages])

  const containerRef = React.useRef(null)

  return (
    <>
      <div className="mt-16 flex flex-row justify-center right-panel">
        <SidebarChat />

        <div
          className="flex flex-col relative pl-[2rem] z-1 w-full overflow-y-auto h-full"
          ref={containerRef}
        >
          <div className={cn('flex-1 pt-4 md:pt-10 pb-4', className)}>
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
            containerRef={containerRef}
          />

          <PreviewToken />
        </div>
      </div>
    </>
  )
}
