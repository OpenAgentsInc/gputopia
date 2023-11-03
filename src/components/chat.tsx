'use client'

import { Message, useChat } from 'ai/react'
import { toast } from 'react-hot-toast'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Sidebar } from './sidebar'
import { useState } from 'react'
import { ChatList } from './chat-list'
import { Chat } from '@/lib/types'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  chats: Chat[]
}

export function Chat({ id, initialMessages, chats }: ChatProps) {
  const [show, setShow] = useState(true)
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
  return (
    <div className="flex flex-1">
      <Sidebar show={show} setShow={setShow} chats={chats} />
      <div className="flex w-full lg:mx-20 flex-col  h-[calc(100vh-64px)] justify-between pt-8">
        {messages.length ? <ChatList messages={messages} /> : <EmptyScreen />}
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
      </div>
    </div>
  )
}
