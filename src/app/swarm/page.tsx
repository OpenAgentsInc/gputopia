"use client"

import { PromptForm } from "@/components/prompt-form"
import { SwarmChatInstance } from "@/components/swarm-chat-instance"
import { useStore } from "@/lib/store"

export default function SwarmPage() {
  const prompt = useStore(state => state.prompt)
  const appends = useStore(state => state.appends);

  const numInstances = 8;
  const instanceIds = Array.from({ length: numInstances }, (_, i) => `id${i + 1}`);

  return <div className="m-24">
    <div className="grid grid-cols-4 gap-4">
      {instanceIds.map(id => (
        <SwarmChatInstance key={id} id={id} />
      ))}
    </div>
    <PromptForm
      onSubmit={async value => {
        for (let i = 0; i < instanceIds.length; i++) {
          const id = instanceIds[i];
          const instanceAppend = appends[id];
          if (instanceAppend) {
            instanceAppend({ content: value, role: 'user' });
            if (i !== instanceIds.length - 1) { // Don't wait after the last append
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
        }
      }}
      input={prompt}
      setInput={value => useStore.setState({ prompt: value as string })}
      isLoading={false}
    />
  </div>
}
