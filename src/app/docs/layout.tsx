// import "@/styles/tailwind.css"
import glob from 'fast-glob'
import { type Metadata } from 'next'
import { Layout } from '@/components/docs/Layout'
import { type Section } from '@/components/docs/SectionProvider'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s - GPUtopia',
    default: 'GPUtopia'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app/docs' })
  let allSectionsEntries = (await Promise.all(
    pages.map(async filename => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections
    ])
  )) as Array<[string, Array<Section>]>
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <div className="h-full pb-24 bg-zinc-900 dark">
      <div className="flex min-h-full antialiased">
        <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </div>
    </div>
  )

  // return (
  //   <html lang="en" className="h-full" suppressHydrationWarning>
  //     <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
  //       <Providers>
  //         <div className="w-full">
  //           <Layout allSections={allSections}>{children}</Layout>
  //         </div>
  //       </Providers>
  //     </body>
  //   </html>
  // )
}
