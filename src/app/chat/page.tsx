import { auth } from '@/auth'
import { Chat } from '@/components/chat'
import { nanoid } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { getChats } from '../actions'

export const runtime = 'edge'

export default async function IndexPage() {
  const id = nanoid()
  const session = await auth()
  if (!session?.user) {
    redirect(`/login`)
  }

  const chats = await getChats(session.user.user_id)

  return <Chat id={id} chats={chats} />
}
