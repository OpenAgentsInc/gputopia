import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentMethods } from '@/lib/hooks/use-payment-methods'

export function PaymentMethods() {
  const paymentMethods = usePaymentMethods()
  // console.log(paymentMethods)
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment Cards</CardTitle>
        <CardDescription>A list of payment cards on your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {paymentMethods.map(paymentMethod => {
          if (paymentMethod.type !== 'card' || !paymentMethod.card) return null
          const { brand, last4, exp_month, exp_year } = paymentMethod.card
          return (
            <div
              key={paymentMethod.id}
              className="mb-2 flex flex-col justify-between border-gray-600 rounded-lg p-3"
            >
              <div className="flex items-center">
                <img src={`/images/${brand}.svg`} alt={brand} className="w-12 mr-3" />
                <div>
                  <div className="text-gray-300">••••{last4}</div>
                  <div className="text-gray-500">
                    Expires {exp_month}/{exp_year}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <Button variant="outline">Add card</Button>
      </CardContent>
    </Card>
  )
}
