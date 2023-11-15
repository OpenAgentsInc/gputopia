'use client'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { Chat } from './components/chat'
import { revalidatePath } from 'next/cache'
import router, { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// export const runtime = 'edge'
// export const preferredRegion = 'home'

export default function IndexPage() {
  const id = nanoid()
  const { data: session } = useSession()

  if (!session?.user) {
    redirect(`/login`)
  }

  redirect(`/chat/${id}`)
}
