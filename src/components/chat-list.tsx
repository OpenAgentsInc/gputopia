import { Message } from "ai"
import { useEffect, useState } from "react"
import { ChatMessage } from "@/components/chat-message"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  const [updatedContents, setUpdatedContents] = useState<Record<number, string>>({});
  const [latestUpdatingIndex, setLatestUpdatingIndex] = useState<number | null>(null);
  const storeLastMessage = useStore(s => s.lastMessage);

  useEffect(() => {
    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];
    const thirdToLastIndex = lastIndex - 2;
    const thirdToLastMessage = messages[thirdToLastIndex];

    if (lastMessage.role === 'assistant') {
      if (thirdToLastMessage?.content !== storeLastMessage) {
        setUpdatedContents(prev => ({ ...prev, [lastIndex]: storeLastMessage }));
      }
      setLatestUpdatingIndex(null);
    } else if (lastMessage.role === 'user') {
      setLatestUpdatingIndex(lastIndex + 1);
      useStore.setState({ lastMessage: "..." });  // Set lastMessage to "Loading"
    }
  }, [messages, storeLastMessage]);


  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        let displayContent;

        // console.log({ index, latestUpdatingIndex, updatedContents })
        if (index === latestUpdatingIndex) {
          displayContent = "..."; // Loading indicator
        } else {
          displayContent = updatedContents[index] ?? message.content;
        }

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
