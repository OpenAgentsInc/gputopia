import { useChat } from "ai/react"
import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ChatList } from "./chat-list"
import { ChatScrollAnchor } from "./chat-scroll-anchor"

export const SwarmChatInstance = ({ id }: { id: string }) => {
  const { messages, append, isLoading } = useChat({
    api: "/api/swarm-chat",
    initialMessages: [],
  });

  const registerAppend = useStore(state => state.registerAppend);

  useEffect(() => {
    if (append) {
      registerAppend(id, append);
    }
  }, []);

  return <div className="m-4">
    {messages.length ? (
      <>
        <ChatList messages={messages} />
        <ChatScrollAnchor trackVisibility={isLoading} />
      </>
    ) : <></>}
  </div>
}
