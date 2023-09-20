'use client'

import { Card } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { ChatBox } from "./chat"

export const Trollbox = () => {
  const user = useStore(state => state.user)
  if (!user) return null
  return (
    <Card className="flex flex-col max-h-[calc(100vh-280px)] overflow-hidden">
      <ChatBox user={user} />
    </Card>
  );
};
