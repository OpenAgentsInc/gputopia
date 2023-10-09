import './globals.css'
import { AxiomWebVitals } from 'next-axiom'
import { Inter } from 'next/font/google'
import Fathom from '@/components/fathom'
import { Sidebar } from '@/components/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { TopNav } from '@/components/top-nav'
import { WebgpuChecker } from '@/components/webgpu-checker'

import type { Metadata } from 'next'
import NextAuthProvider from './context/NextAuthProvider'
import Script from 'next/script'
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
            <div className="flex h-screen mt-16">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                {' '}
                {/* Added overflow-auto */}
                {children}
              </main>
            </div>
          </ThemeProvider>
          <Fathom />
        </NextAuthProvider>
      </body>
    </html>
  )
}
