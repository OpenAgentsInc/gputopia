import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCreditDialog } from './AddCreditDialog'

export function AccountCredit() {
  return (
    <Card className="mt-6 w-72">
      <CardHeader>
        <CardTitle>Credit</CardTitle>
        <CardDescription>Prepaid account credit</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="-my-2 text-2xl text-center">$0.00</div>
      </CardContent>
      <CardFooter className="w-full">
        <AddCreditDialog />
      </CardFooter>
    </Card>
  )
}
