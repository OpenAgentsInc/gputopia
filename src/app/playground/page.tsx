import { BackgroundImage } from '@/components/background-image'

export default function Playground() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-grow justify-center">
        <BackgroundImage />
        <div className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-20 min-h-screen flex flex-col">
          <div className="mx-auto max-w-2xl p-4 sm:p-0"></div>
        </div>
      </div>
    </div>
  )
}
