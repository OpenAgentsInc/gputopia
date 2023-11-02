import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getChat, getChats } from '@/app/actions'
import { Chat } from '@/components/chat'

import { auth } from '@/auth'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.user_id)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.user_id) {
    notFound()
  }

  const chats = await getChats(session.user.user_id)

  return <Chat id={chat.id} initialMessages={chat.messages} chats={chats} />
}
