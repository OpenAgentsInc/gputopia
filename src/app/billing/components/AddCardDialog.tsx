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

export function AddCardDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add payment method</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>
          <DialogDescription>Add a new payment to your account</DialogDescription>
        </DialogHeader>

        <CheckoutForm />
      </DialogContent>
    </Dialog>
  )
}
