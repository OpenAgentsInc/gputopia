import "./globals.css"
import { AxiomWebVitals } from "next-axiom"
import { Inter } from "next/font/google"
import * as React from "react"
import Fathom from "@/components/fathom"
import { SidebarChat } from "@/components/sidebar-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { TopNav } from "@/components/top-nav"
import { WebgpuChecker } from "@/components/webgpu-checker"

import type { Metadata } from 'next'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GPUtopia',
  description: 'Your GPU Marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AxiomWebVitals />
        <WebgpuChecker />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopNav />
          <div className="flex h-screen mt-16">
            <SidebarChat />
            <main className="flex-1 overflow-auto"> {/* Added overflow-auto */}
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Fathom />
      </body>
    </html>
  )
}
