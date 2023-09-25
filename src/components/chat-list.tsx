import { Message } from "ai"
import { ChatMessage } from "@/components/chat-message"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  const storeLastMessage = useStore(s => s.lastMessage)
  const updatedMessages = [...messages];

  const lastMessageIndex = messages.findIndex((msg, idx) => msg.role === 'assistant' && idx === messages.length - 1);

  if (lastMessageIndex !== -1) {
    updatedMessages[lastMessageIndex] = { ...updatedMessages[lastMessageIndex], content: storeLastMessage };
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {updatedMessages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
