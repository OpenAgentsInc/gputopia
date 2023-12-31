// 'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { SellMenu } from './sell-menu'
import { auth } from '@/auth'

const linkClasses = 'text-sm font-medium transition-colors hover:text-primary'

export async function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  // const pathname = usePathname()
  // const isActive = (path: string) => pathname === path
  const isActive = () => false
  // const user = useStore(state => state.user)
  const session = await auth()
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link
        href="/"
        className={cn(
          'tracking-wide text-white text-lg font-bold transition-colors hover:text-primary mr-4 p-1.5 flex flex-row items-center'
        )}
        style={{ height: 60 }}
      >
        GPUTOPIA
      </Link>
      <Link
        href="/blog"
        className={cn(linkClasses, {
          'text-white': isActive('/blog'),
          'text-muted-foreground': !isActive('/blog')
        })}
      >
        <span className="mx-2">Blog</span>
      </Link>
      <Link
        href="/beta"
        className={cn(linkClasses, {
          'text-white': isActive('/beta'),
          'text-muted-foreground': !isActive('/beta')
        })}
      >
        <span className="mx-2">Beta</span>
      </Link>
      <Link
        href="/docs"
        className={cn(linkClasses, {
          'text-white': isActive('/docs'),
          'text-muted-foreground': !isActive('/docs')
        })}
      >
        <span className="mx-2 mr-6">Docs</span>
      </Link>
      {!!session?.user && <SellMenu />}
    </nav>
  )
}
