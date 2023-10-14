'use client'

import Pusher, * as PusherTypes from 'pusher-js'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { generate } from '@/lib/webllm'
import { useSession } from 'next-auth/react'

export function PusherConnector() {
  const { data: session } = useSession()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let userId = session?.user.user_id
    if (userId) {
      setUserId(userId)
    }
  }, [session?.user.user_id])

  useEffect(() => {
    if (!userId || userId === null) return
    const pusher = new Pusher('e12c6b8ab6c32132e3bf', {
      cluster: 'mt1'
    })

    const presenceChannel = pusher.subscribe('presence-common_room')
    presenceChannel.bind('pusher:subscription_succeeded', (members: PusherTypes.Members) => {
      useStore.getState().setCount(members.count)
    })
    presenceChannel.bind('pusher:member_added', (member: any) => {
      useStore.getState().increment()
      // console.log('Member added:', member)
    })
    presenceChannel.bind('pusher:member_removed', (member: any) => {
      // console.log('Member removed:', member)
      useStore.getState().decrement()
    })

    // Subscribe to user-specific channel if userId is available
    if (userId) {
      const userChannel = pusher.subscribe(`private-user-${userId}`) // should be userId
      userChannel.bind('JobAssigned', async (data: any) => {
        return await generate(data.job)
      })
    }

    window.pusher = pusher
  }, [userId])

  return null
}
