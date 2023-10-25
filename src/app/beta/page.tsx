'use client'

import { BackgroundImage } from '@/components/background-image'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ExternalLink,
  TypographyH1 as H1,
  TypographyH2 as H2,
  TypographyH3 as H3,
  TypographyP as P
} from '@/components/ui/typography'
import { RocketIcon } from '@radix-ui/react-icons'

export default function Beta() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-grow justify-center">
        <BackgroundImage />

        <div className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-20 min-h-screen flex flex-col">
          <div className="mx-auto max-w-2xl p-4 sm:p-0">
            <Alert>
              <RocketIcon className="h-8 w-8" />
              <AlertTitle className="ml-4 text-lg">16 Oct Update</AlertTitle>
              <AlertDescription className="ml-4 text-muted-foreground">
                Our beta web interface is back up. Codebase is under heavy development so may be unstable.
                Join our{' '}
                <ExternalLink className="text-cyan-500" href="https://discord.gg/f6nP3CQhZt">
                  Discord
                </ExternalLink>{' '}
                for updates.
              </AlertDescription>
            </Alert>

            <H2 className="pt-4 my-8">Welcome to the GPUtopia Beta</H2>

            <P className="mt-12">
              <strong className="text-white text-lg text-center italic">
                Sell us your GPU capacity for bitcoin!
              </strong>
            </P>

            <ul className="tracking-wide leading-loose ml-4 my-2" style={{ color: '#a1a1aa' }}>
              <li>✅ No special software needed &mdash; just a Chrome browser</li>
              <li>✅ Most desktops & laptops supported</li>
              <li>✅ Get paid automatically to your Alby Lightning wallet</li>
            </ul>

            <h2 className="mt-12 font-bold text-xl">Why are we doing this?</h2>

            <P>We&apos;re building a marketplace for GPU compute.</P>

            <ul className="tracking-wide leading-loose ml-4" style={{ color: '#a1a1aa' }}>
              <li>💻 SELLERS rent out their GPU compute in exchange for bitcoin.</li>
              <li>🛍️ BUYERS pay bitcoin to use GPU compute for AI training or inference.</li>
            </ul>

            <P>
              In this first version, we are focusing on the seller experience. We want to make it as easy as
              possible for you to sell your GPU compute.
            </P>

            <P>
              For now GPUtopia is the buyer of your compute. Soon we&apos;ll open this up to other buyers.
            </P>

            <h2 className="mt-12 font-bold text-xl">How does it work?</h2>

            <P>
              GPUtopia uses a portion of your computer&apos;s GPU via{' '}
              <ExternalLink href="https://www.w3.org/TR/webgpu/">WebGPU</ExternalLink>
              <span className="-ml-1">,</span> a new web standard that was{' '}
              <ExternalLink href="https://developer.chrome.com/blog/webgpu-release/">
                recently added
              </ExternalLink>{' '}
              to newer versions of Chrome.
            </P>

            <P>
              First your browser needs to download a language model. This is a ~4GB file that will be stored
              in your browser&apos;s cache. This will take a few minutes to download, then ~20 seconds to load
              from cache on future visits. You can see how this works in the{' '}
              <ExternalLink href="https://github.com/mlc-ai/web-llm">MLC WebLLM repo</ExternalLink>
              <span className="-ml-1">.</span>
            </P>

            <P>
              Once you&apos;ve got the model loaded, our system marks you available to receive inference jobs.
              Currently we send a demo inference job to all connected users every 15 seconds. This job may
              take ~5-30 seconds to complete depending on your GPU and the size of the job.
            </P>

            <P>
              When your computer finishes the inference job, it sends that back to our server and we reward
              you some bitcoin directly to your Alby wallet.
            </P>

            <P>
              It takes about 2 minutes to create an Alby wallet if you don&apos;t already have one &mdash;
              then you&apos;ll be ready to start earning bitcoin. Learn more about Alby on their{' '}
              <ExternalLink href="https://getalby.com">website</ExternalLink>.
            </P>

            <h2 className="mt-12 font-bold text-xl">Any questions?</h2>

            <P>
              Tweet at us <ExternalLink href="https://twitter.com/gputopia">@GPUtopia</ExternalLink> or email
              us at info@gputopia.ai.
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
