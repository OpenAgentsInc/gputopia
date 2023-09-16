import "./globals.css"
import { Inter } from "next/font/google"

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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
