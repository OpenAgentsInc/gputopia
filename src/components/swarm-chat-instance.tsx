import { useChat } from "ai/react"
import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ChatList } from "./chat-list"
import { ChatScrollAnchor } from "./chat-scroll-anchor"

export const SwarmChatInstance = () => {
  const { messages, append, isLoading } =
    useChat({
      api: "/api/swarm-chat",
      initialMessages: [],
    })
  useEffect(() => {
    useStore.setState({ badAppend: append })
  }, [])
  return <div className="m-24 w-2/5">
    {messages.length ? (
      <>
        <ChatList messages={messages} />
        <ChatScrollAnchor trackVisibility={isLoading} />
      </>
    ) : <></>}
  </div>
}
