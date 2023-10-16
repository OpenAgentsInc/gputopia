import { auth } from '@/auth'
import { Chat } from '@/components/chat'
import { nanoid } from '@/lib/utils'
import { redirect } from 'next/navigation'

export const runtime = 'edge'
export const preferredRegion = 'home'

export default async function IndexPage() {
  const id = nanoid()

  const session = await auth()

  if (!session?.user) {
    redirect(`/login`)
  }

  return <Chat id={id} />
}
