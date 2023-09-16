"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { GetInfoResponse, MakeInvoiceResponse } from "@webbtc/webln-types"

export default function Home() {

  useEffect(() => {
    if (typeof window.webln !== 'undefined') {
      console.log('WebLN is available!');
    }
  }, [])

  const connect = async () => {
    if (!window.webln) return
    try {
      await window.webln.enable();
      const info: GetInfoResponse = await window.webln.getInfo();
      console.log("Connected via WebLN")
      console.log("GetInfoResponse", info)

      const invoice: MakeInvoiceResponse = await window.webln.makeInvoice({
        amount: 8,
        defaultMemo: "WebLN Test",
      });
      console.log("Invoice", invoice)

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row justify-center space-x-6">
        <Button onClick={connect}>Connect via WebLN</Button>
        <ModeToggle />
      </div>
    </main>
  )
}
