import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import { TypographyH2 } from '@/components/ui/typography'
import { useStore } from '@/lib/store'

export function AddCreditDialog() {
  const [credit, setCredit] = useState(25)
  const [loading, setLoading] = useState(false)
  const paymentMethods = useStore(state => state.paymentMethods)
  const paymentMethod = paymentMethods?.[0] ?? null
  const [open, setOpen] = useState(false)

  const pay = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: credit,
        customer: paymentMethod.customer,
        paymentMethod: paymentMethod.id
      })
    })
    const { success, status } = await res.json()

    setOpen(false)
    setLoading(false)
    if (!res.ok || !success) {
      alert(`Something went wrong. Please try again. (${status})`)
      return
    } else {
      alert(`Success! Your account has been funded $${credit}. (Refresh the page to update balance)`)
    }
  }

  if (!paymentMethod)
    return (
      <p className="text-xs italic text-muted-foreground">
        To fund your account, add a payment method below.
      </p>
    )
  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={!paymentMethod}>
          Fund account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add funds</DialogTitle>
          <DialogDescription>Fund your account with credits for AI services.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-row items-center justify-center">
          <Slider
            value={[credit]}
            onValueChange={value => setCredit(value[0])}
            max={100}
            min={10}
            step={1}
            className="w-[60%]"
          />
          <div className="w-20">
            <TypographyH2>
              <span className="mx-4 w-12">${credit}</span>
            </TypographyH2>
          </div>
        </div>
        <form onSubmit={pay} className="flex flex-col items-center">
          <Button className="mt-2 w-48" type="submit" disabled={loading}>
            {loading ? `Processing...` : `Pay $${credit}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
