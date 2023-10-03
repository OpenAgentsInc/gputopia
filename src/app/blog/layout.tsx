import glob from "fast-glob"
import { type Metadata } from "next"
import { BlogLayout } from "@/components/docs/BlogLayout"
import { type Section } from "@/components/docs/SectionProvider"
import { BackgroundImage } from "@/components/background-image"

export const metadata: Metadata = {
  title: {
    template: '%s - GPUtopia',
    default: 'GPUtopia',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app/blog' })
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <div className="h-full pb-24 dark">
      <div className="flex min-h-full antialiased">
        <div className="w-full">
          <BackgroundImage />
          <BlogLayout allSections={allSections}>{children}</BlogLayout>
        </div>
      </div>
    </div>
  )
}
