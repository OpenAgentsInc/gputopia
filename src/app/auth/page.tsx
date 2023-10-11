'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

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
