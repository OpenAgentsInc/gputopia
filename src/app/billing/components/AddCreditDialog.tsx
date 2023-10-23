import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { CheckoutForm } from './CheckoutForm'

export function AddCreditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Fund account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add funds</DialogTitle>
          <DialogDescription>Fund your account with credits for AI services</DialogDescription>
        </DialogHeader>

        {/* <CheckoutForm /> */}
      </DialogContent>
    </Dialog>
  )
}
