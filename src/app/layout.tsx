import './globals.css'
import { AxiomWebVitals } from 'next-axiom'
import { Inter } from 'next/font/google'
import Fathom from '@/components/fathom'
import { ThemeProvider } from '@/components/theme-provider'
import { TopNav } from '@/components/top-nav'
import { WebgpuChecker } from '@/components/webgpu-checker'
import { SidebarChat } from '@/components/sidebar-chat'

import type { Metadata } from 'next'
import NextAuthProvider from './context/NextAuthProvider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GPUtopia',
  description: 'Your GPU Marketplace'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <AxiomWebVitals />
          <WebgpuChecker />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TopNav />
            <main className="flex flex-1 overflow-auto mt-16">{children}</main>
          </ThemeProvider>
          <Fathom />
        </NextAuthProvider>
      </body>
    </html>
  )
}
