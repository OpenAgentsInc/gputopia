import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaymentMethods } from '@/lib/hooks/use-payment-methods'
import { AddCardDialog } from './AddCardDialog'
import { useRouter } from 'next/navigation'

export function PaymentMethods() {
  const router = useRouter()
  const { paymentMethods, fetchData } = usePaymentMethods()
  const deletePaymentMethod = async (id: string) => {
    const res = await fetch('/api/payment-methods', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (res.ok && data.success) {
      alert('Payment method deleted successfully')
      router.replace('/billing')
      fetchData()
    } else {
      alert('Unknown error, please try again')
    }
  }
  return (
    <Card className="mt-6 w-72">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Your active payment method</CardDescription>
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
        {paymentMethods.length === 0 && <AddCardDialog />}
      </CardContent>
    </Card>
  )
}
