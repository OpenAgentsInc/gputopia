export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-12">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-3 text-lg font-semibold">Welcome to GPUtopia AI Chat</h1>
        <p className="mb-3 leading-normal text-muted-foreground">
          This is a chatbot using swarm AI, a decentralized network of GPU nodes.
        </p>
        <p className="mb-3 leading-normal text-muted-foreground">
          Inferences are paid in bitcoin sats, for now 7 sats per Vicuna inference. GPUtopia takes a 1-sat
          platform fee and the rest goes to the provider of the GPU compute that processes the inference.
        </p>
        <p className="mb-3 leading-normal text-muted-foreground">
          Conversations are not saved. Your messages are not shared, but also not private. Don&apos;t share
          sensitive information.
        </p>
      </div>
    </div>
  )
}
