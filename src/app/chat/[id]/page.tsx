import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getChat } from '@/app/actions'
import { Chat } from '../components/chat'
import { auth } from '@/auth'

//export const runtime = 'edge'
//export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/login`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    const id = params.id
    return <Chat key={id} id={id} />
  }

  return <Chat key={chat.id} id={chat.id} initialMessages={chat.messages} />
}
