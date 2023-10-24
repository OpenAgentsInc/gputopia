import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCreditDialog } from './AddCreditDialog'
import { useStore } from '@/lib/store'

function formatCentsToDollars(cents: number) {
  const dollars = Math.floor(cents / 100)
  const remainingCents = cents % 100
  return `${dollars}.${remainingCents.toString().padStart(2, '0')}`
}

export function AccountCredit() {
  const cents = useStore(state => state.balanceUsd)
  return (
    <Card className="mt-6 w-72">
      <CardHeader>
        <CardTitle>Credit (demo mode)</CardTitle>
        <CardDescription>Prepaid account credit</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="-my-2 text-2xl text-center">${formatCentsToDollars(cents)}</div>
      </CardContent>
      <CardFooter className="w-full">
        <AddCreditDialog />
      </CardFooter>
    </Card>
  )
}
