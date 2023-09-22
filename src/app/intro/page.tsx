"use client"

import { TopNav } from "@/components/top-nav"
import {
    ExternalLink, TypographyH1 as H1, TypographyH2 as H2, TypographyH3 as H3,
    TypographyP as P
} from "@/components/ui/typography"

export default function Intro() {

  return (
    <div className="flex flex-col h-screen">
      <TopNav />

      <div className="flex flex-col flex-grow justify-center">
        <div style={{
          backgroundImage: "url('/images/flares2.png')",
          opacity: 0.5,
          top: 65,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -1,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
          className="fixed inset-0 -z-20 h-screen w-screen object-cover"
        >
        </div>

        <div className="relative isolate overflow-hidden pb-16 pt-16 sm:pb-20 min-h-screen flex flex-col justify-center">
          <div className="mx-auto max-w-2xl p-4 sm:p-0">
            <time dateTime="2022-09-05" className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500">
              <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
              <span className="ml-3">September 12, 2023</span>
            </time>

            <H1 className="mt-8">Toward an Open GPU Mesh</H1>

            <P><strong className="italic">The
              GPU arms race has begun.</strong>
            </P>

            <P>
              Companies large and small are <ExternalLink href="https://gpus.llm-utils.org/nvidia-h100-gpus-supply-and-demand/">scrambling
              </ExternalLink> to hoard GPUs, which are now "considerably harder to get than drugs." [<ExternalLink href="https://youtu.be/nxbZVH9kLao?t=30">Elon</ExternalLink>]
            </P>

            <P>Some large companies are not only stockpiling GPUs, they are actively <ExternalLink href="https://twitter.com/JosephJacks_/status/1698139860383780924">lobbying</ExternalLink> governments to
              establish "safety" regulations, creating barriers for smaller players.
            </P>

            <P>
              It's the familiar pattern of <ExternalLink href="https://wiki.mises.org/wiki/Regulatory_capture">regulatory capture</ExternalLink> dressed in sheep's clothing, a blatant
              power play to stifle competition.
            </P>

            <P>
              But what if we could level the playing field?
            </P>

            <P>
              <strong className="italic">What if we could enable unstoppable, universal access to GPU compute?</strong>
            </P>


            <H2 className="mt-10">Introducing GPUtopia</H2>

            <P>
              You, the person reading this, likely own or can access one or more computers with unused GPU capacity.
            </P>

            <P>
              <strong className="italic">Would you sell that extra GPU capacity if you could?</strong>
            </P>

            <P>
              We think a lot of people would.
            </P>

            <P>
              So what if we connect all such devices together into <strong>one global mesh network for GPU compute?</strong>
            </P>

            <P>
              This is not a new idea. There are a handful of existing projects with the same goal, some of which have <ExternalLink href="https://decrypt.co/144068/gensyn-ai-secures-43m-for-decentralized-machine-learning-led-by-a16z">raised</ExternalLink> millions of dollars, but they all seem to have some garbage crypto token or convoluted crypto "governance" mechanism. Hilarious and unnecessary.
            </P>

            <P>
              Connecting buyers and sellers of GPU compute should be simple.
            </P>

            <P>
              No gatekeeping or quotas or waitlists or whitepapers or tokens, just a simple marketplace with pricing set through flexible supply and demand.
            </P>

            <P>
              Pay with any usual payment method and get the compute you need. And if you want the best rates, avoid any possibility of chargeback fraud by paying and earning in <ExternalLink href="https://bitcoin.org/">bitcoin</ExternalLink>.
            </P>

            <P>
              That's what we're building. Now we'd love your help to test what we've built so far.
            </P>

            <H2 className="mt-10">Join us</H2>

            <P>
              Today we launched the beta version of our GPU seller experience. It enables anyone to sell their GPU compute for bitcoin using nothing but their web browser.
            </P>

            <P>
              Later this month we'll launch the buyer experience, enabling anyone to easily purchase that compute for a variety of AI/ML workloads.
            </P>

            <P>
              Over the coming weeks and months, we will rapidly add support for more devices and more workloads. We'll prioritize new features according to the feedback of our active users, so please get involved and tell us what you'd love to see.
            </P>

            <P>
              <strong className="italic">See you in GPUtopia!</strong>
            </P>
          </div></div>
      </div>
    </div>
  )
}
