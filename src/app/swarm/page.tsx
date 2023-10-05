"use client"

import { Button } from "@/components/docs/Button"
import { Textarea } from "@/components/ui/textarea"

export default function SwarmPage() {
  const submit = (e: any) => {
    e.preventDefault()
    console.log("test")
  }
  return <div className="m-24 w-2/5">
    <p className="text-muted-foreground">Lets begin by sending one inference to multiple sellers and streaming the results.</p>
    <form onSubmit={submit} className="mt-8 flex flex-col items-start">
      <Textarea placeholder="Enter your prompt" rows={4} />
      <Button variant="secondary" type="submit" className="mt-4">Submit</Button>
    </form>
  </div>
}
