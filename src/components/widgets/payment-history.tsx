import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { updatePayments } from "@/lib/update-payments"

export const PaymentHistory = () => {
  const payments = useStore(state => state.payments)
  const user = useStore(state => state.user)

  useEffect(() => {
    if (!user) return
    updatePayments()
  }, [user]);

  const formatTimeToLocal = (createdAt: string) => {
    const localTime = new Date(createdAt).toLocaleTimeString(undefined, {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return localTime;
  };

  return (
    <Card className="flex flex-col max-h-[calc(100vh-280px)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col overflow-y-auto">
        {!!payments && payments.length > 0 && (
          <ul className="text-sm space-y-2">
            {payments.map((payment: any, index) => (
              <li key={index} className="flex justify-between">
                <span>Withdrew {payment.amount} sats</span>
                <span className="text-muted-foreground">{formatTimeToLocal(payment.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
