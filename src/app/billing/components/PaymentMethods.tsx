import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentMethods } from '@/lib/hooks/use-payment-methods'
import { AddCardDialog } from './AddCardDialog'

export function PaymentMethods() {
  const paymentMethods = usePaymentMethods()
  const deletePaymentMethod = async (id: string) => {
    console.log("Let's delete payment method id: ", id)
    const res = await fetch('/api/payment-methods', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    console.log(data)
  }
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment Cards</CardTitle>
        <CardDescription>A list of payment cards on your account</CardDescription>
      </CardHeader>
      <CardContent className="-mt-2 grid gap-4">
        {paymentMethods.map(paymentMethod => {
          if (paymentMethod.type !== 'card' || !paymentMethod.card) return null
          const { brand, last4, exp_month, exp_year } = paymentMethod.card
          const id = paymentMethod.id
          return (
            <div key={id} className="mb-2 flex flex-col justify-between border-gray-600 rounded-lg p-3">
              <div className="flex items-center">
                <img src={`/images/${brand}.svg`} alt={brand} className="w-12 mr-3" />
                <div>
                  <div className="text-gray-300">••••{last4}</div>
                  <div className="text-gray-500">
                    Expires {exp_month}/{exp_year}
                  </div>
                  <Button
                    onClick={() => deletePaymentMethod(id)}
                    variant="outline"
                    size="sm"
                    className="mt-2 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
        <AddCardDialog />
      </CardContent>
    </Card>
  )
}
