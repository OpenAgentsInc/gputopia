import { type Message } from 'ai'
import { ChatMessage } from '@/components/chat-message'
import { Separator } from '@/components/ui/separator'

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return
  }

  return (
    <div className="mx-auto lg:w-2/3 s:w-full px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && <Separator className="my-4 md:my-8" />}
        </div>
      ))}
    </div>
  )
}
