"use client"

interface WebLN {
  // todo
}

declare global {
  interface Window {
    webln: WebLN;
  }
}

import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    if (typeof window.webln !== 'undefined') {
      console.log('WebLN is available!');
    }
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Beta
          <code className="font-mono font-bold ml-2">v2</code>
        </p>
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-green-200 after:via-green-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-green-700 before:dark:opacity-10 after:dark:from-green-900 after:dark:via-[#00ff00] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="font-mono text-3xl font-bold">GPUtopia</h1>
      </div>
      <div />
    </main>
  )
}
