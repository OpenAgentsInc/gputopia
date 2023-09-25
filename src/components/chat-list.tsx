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
  console.log(messages)

  const lastMessage = messages[messages.length - 1];

  // Update the 'content' prop only if the role is 'assistant'
  if (lastMessage.role === 'assistant') {
    lastMessage.content = storeLastMessage;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
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
