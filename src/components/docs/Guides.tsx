import { Button } from "@/components/docs/Button"
import { Heading } from "@/components/docs/Heading"

const guides = [
  {
    href: '/docs/faq',
    name: 'FAQ',
    description: 'Answers to frequently asked questions',
  },
  {
    href: '/docs/buying',
    name: 'Buying Compute',
    description: 'Learn how to buy and use GPU compute',
  },
  {
    href: '/docs/selling',
    name: 'Selling Compute',
    description:
      'Learn how to sell your GPU compute',
  },
  {
    href: '/docs/opensource',
    name: 'Open Source',
    description:
      'Learn about the GPUtopia codebase',
  }
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
