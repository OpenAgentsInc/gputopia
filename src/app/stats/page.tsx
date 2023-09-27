"use client"

import { useEffect } from "react"
import { BackgroundImage } from "@/components/background-image"

export default function Stats() {
  useEffect(() => {
    console.log(window.pusher)
  }, [])
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-grow justify-center">
        <BackgroundImage />
      </div>
    </div>
  )
}
