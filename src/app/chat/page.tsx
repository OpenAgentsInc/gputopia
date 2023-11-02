import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { Chat } from './components/chat'
import { revalidatePath } from 'next/cache'
import router, { useRouter } from 'next/router'

// export const runtime = 'edge'
// export const preferredRegion = 'home'

export default async function IndexPage() {
  const id = nanoid()
  const session = await auth()

  if (!session?.user) {
    redirect(`/login`)
  }

  return <Chat key={id} id={id} />
}
