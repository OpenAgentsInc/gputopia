'use client'

import { usePathname } from 'next/navigation'
import { Section, SectionProvider } from '@/components/docs/SectionProvider'

export function BlogLayout({
  children,
  allSections
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  let pathname = usePathname()

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="h-full lg:ml-72 xl:ml-80">
        <div className="relative flex min-h-screen h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
        </div>
      </div>
    </SectionProvider>
  )
}
