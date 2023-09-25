"use client"

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useStore } from "@/lib/store"

export const WebgpuChecker = () => {
  const showWebgpuWarning = useStore(state => state.showWebgpuWarning)
  return (
    <Dialog open={showWebgpuWarning} onOpenChange={() => useStore.setState({ showWebgpuWarning: false })}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Browser not supported</DialogTitle>
          <DialogDescription>
            Your browser does not support WebGPU, so you won&apos;t be able to sell GPU compute here. Please try Chrome on a desktop or laptop.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
