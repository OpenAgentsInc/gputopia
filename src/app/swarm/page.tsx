"use client"

import { PromptForm } from "@/components/prompt-form"
import { SwarmChatInstance } from "@/components/swarm-chat-instance"
import { useStore } from "@/lib/store"

export default function SwarmPage() {
  const prompt = useStore(state => state.prompt)
  const append = useStore(state => state.badAppend)
  return <div className="m-24 w-2/5">
    <SwarmChatInstance />
    <PromptForm
      onSubmit={async value => {
        await append({
          content: value,
          role: 'user'
        })
        console.log('did that horrible thing work')
      }}
      input={prompt}
      setInput={value => useStore.setState({ prompt: value as string })}
      isLoading={false}
    />
  </div>
}
