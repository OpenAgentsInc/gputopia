"use client"

import { useChat } from "ai/react"
import { ChatList } from "@/components/chat-list"
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor"
import { PromptForm } from "@/components/prompt-form"

export default function SwarmPage() {
  const { messages, append, isLoading, input, setInput } =
    useChat({
      api: "/api/swarm-chat",
      initialMessages: [],
    })
  return <div className="m-24 w-2/5">
    {messages.length ? (
      <>
        <ChatList messages={messages} />
        <ChatScrollAnchor trackVisibility={isLoading} />
      </>
    ) : <></>}
    <PromptForm
      onSubmit={async value => {
        await append({
          content: value,
          role: 'user'
        })
      }}
      input={input}
      setInput={setInput}
      isLoading={isLoading}
    />
  </div>
}
