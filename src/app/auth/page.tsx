'use client'

import { fetchUserFromAlby } from '@/lib/alby'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const userEndpoint = 'https://api.getalby.com/user/me'
const tokenEndpoint = 'https://api.getalby.com/oauth/token'
const clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET

export default function Auth() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      const redirect_to = window.sessionStorage.getItem('redirect_to')
      window.location.href = redirect_to ?? '/'
    }
  }, [session, status])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div id="loader" className="loader"></div>
    </div>
  )
}
