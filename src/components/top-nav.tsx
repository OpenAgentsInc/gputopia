'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { PusherConnector } from '@/components/pusher-connector'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'
import { OnlineUsers } from './online-users'
import { SatsBalance } from './sats-balance'
import { ModeToggle } from './ui/mode-toggle'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAlby } from '@/lib/useAlby'
import { useEffect } from 'react'

export const TopNav = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  useAlby()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn()
    }
  }, [session])

  return (
    <>
      {status === 'authenticated' && <PusherConnector />}
      <div className="border-b fixed top-0 left-0 right-0 z-50 backdrop-blur bg-background/80">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          {/* <ModeToggle /> */}
          <div className="ml-auto flex items-center space-x-4">
            {status === 'authenticated' && <OnlineUsers />}
            {status === 'authenticated' && <SatsBalance />}
            {pathname !== '/auth' && (
              <>
                {session?.user ? (
                  <UserNav user={session.user} signout={signOut} />
                ) : (
                  <Link href="/login">
                    <Button variant="outline">Log in</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>
