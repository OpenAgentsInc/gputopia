import { Message } from "ai"
import { useEffect, useState } from "react"
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

  const [updatedContents, setUpdatedContents] = useState<Record<number, string>>({});
  const storeLastMessage = useStore(s => s.lastMessage);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;

    if (lastMessage.role === 'assistant') {
      setUpdatedContents(prev => ({
        ...prev,
        [lastIndex]: storeLastMessage,
      }));
    }
  }, [messages, storeLastMessage]);

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        const updatedContent = updatedContents[index];
        const displayContent = updatedContent ?? message.content;

        return (
          <div key={index}>
            <ChatMessage message={{ ...message, content: displayContent }} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>
        );
      })}
    </div>
  )
}
