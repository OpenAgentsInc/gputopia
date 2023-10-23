import './globals.css'
import { AxiomWebVitals } from 'next-axiom'
import { Inter } from 'next/font/google'
import Fathom from '@/components/fathom'
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
            {children}
          </ThemeProvider>
          <Fathom />
        </NextAuthProvider>
      </body>
    </html>
  )
}
