"use client"

import { PromptForm } from "@/components/prompt-form"
import { SwarmChatInstance } from "@/components/swarm-chat-instance"
import { useStore } from "@/lib/store"

export default function SwarmPage() {
  const prompt = useStore(state => state.prompt)
  const appends = useStore(state => state.appends);

  const instanceIds = ["id1", "id2", "id3", "id4", "id5", "id6", "id7", "id8"];

  return <div className="m-24">
    <div className="grid grid-cols-4 gap-4">
      {instanceIds.map(id => (
        <SwarmChatInstance key={id} id={id} />
      ))}
    </div>
    <PromptForm
      onSubmit={async value => {
        instanceIds.forEach(id => {
          const instanceAppend = appends[id];
          if (instanceAppend) {
            instanceAppend({ content: value, role: 'user' });
          }
        });
      }}
      input={prompt}
      setInput={value => useStore.setState({ prompt: value as string })}
      isLoading={false}
    />
  </div>
}
