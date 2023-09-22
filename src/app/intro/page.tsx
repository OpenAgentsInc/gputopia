"use client"

import { MainNav } from "@/components/main-nav"
import { PusherConnector } from "@/components/pusher-connector"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { startAlbyOauth } from "@/lib/alby-oauth"
import { useAlby } from "@/lib/useAlby"

export default function Intro() {
  const { authed, logout, user } = useAlby()
  return (
    <div className="flex flex-col h-screen">
      {authed && <PusherConnector />}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            {user ? <UserNav user={user} logout={logout} /> : <Button variant="outline" onClick={startAlbyOauth}>Log in with Alby</Button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-center">
        <div style={{
          backgroundImage: "url('/images/flares2.png')",
          opacity: 0.5,
          // position: 'absolute',
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

        <div className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-20 min-h-screen flex flex-col justify-center">
          <div className="mx-auto max-w-2xl p-4 sm:p-0">
            <time dateTime="2022-09-05" className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500">
              <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
              <span className="ml-3">September 12, 2023</span>
            </time>

            <h1 className="mt-8 mb-10 text-4xl font-bold tracking-tight sm:text-5xl">Toward an Open GPU Mesh</h1>

            <p><strong className="italic">The
              GPU arms race has begun.</strong>
            </p>

            <p>
              Companies large and small are <a href="https://gpus.llm-utils.org/nvidia-h100-gpus-supply-and-demand/">scrambling
              </a>
              to hoard GPUs, which are now "considerably harder to get than drugs." [<a className="-ml-1" href="https://youtu.be/nxbZVH9kLao?t=30">Elon</a><span className="-ml-1">]</span>
            </p>

            <p>Some large companies are not only stockpiling GPUs, they are actively <a href="https://twitter.com/JosephJacks_/status/1698139860383780924">lobbying</a> governments to
              establish "safety" regulations, creating barriers for smaller players.
            </p>

            <p>
              It's the familiar pattern of <a href="https://wiki.mises.org/wiki/Regulatory_capture">regulatory capture</a> dressed in sheep's clothing, a blatant
              power play to stifle competition.
            </p>

            <p>
              But what if we could level the playing field?
            </p>

            <p>
              <strong className="italic">What if we could enable unstoppable, universal access to GPU compute?</strong>
            </p>


            <h2 className="font-bold text-2xl mt-10">Introducing GPUtopia</h2>

            <p>
              You, the person reading this, likely own or can access one or more computers with unused GPU capacity.
            </p>

            <p>
              <strong className="italic">Would you sell that extra GPU capacity if you could?</strong>
            </p>

            <p>
              We think a lot of people would.
            </p>

            <p>
              So what if we connect all such devices together into <strong>one global mesh network for GPU compute?</strong>
            </p>

            <p>
              This is not a new idea. There are a handful of existing projects with the same goal, some of which have <a href="https://decrypt.co/144068/gensyn-ai-secures-43m-for-decentralized-machine-learning-led-by-a16z">raised</a> millions of dollars, but they all seem to have some garbage crypto token or convoluted crypto "governance" mechanism. Hilarious and unnecessary.
            </p>

            <p>
              Connecting buyers and sellers of GPU compute should be simple.
            </p>

            <p>
              No gatekeeping or quotas or waitlists or whitepapers or tokens, just a simple marketplace with pricing set through flexible supply and demand.
            </p>

            <p>
              Pay with any usual payment method and get the compute you need. And if you want the best rates, avoid any possibility of chargeback fraud by paying and earning in <a href="https://bitcoin.org/">bitcoin</a><span className="-ml-1">.</span>
            </p>

            <p>
              That's what we're building. Now we'd love your help to test what we've built so far.
            </p>

            <h2 className="font-bold text-2xl mt-10">Join us</h2>

            <p>
              Today we launched the beta version of our GPU seller experience. It enables anyone to sell their GPU compute for bitcoin using nothing but their web browser.
            </p>

            <p>
              Later this month we'll launch the buyer experience, enabling anyone to easily purchase that compute for a variety of AI/ML workloads.
            </p>

            <p>
              Over the coming weeks and months, we will rapidly add support for more devices and more workloads. We'll prioritize new features according to the feedback of our active users, so please get involved and tell us what you'd love to see.
            </p>

            <p>
              <strong className="italic">See you in GPUtopia!</strong>
            </p>
          </div></div>
      </div>
    </div>
  )
}
