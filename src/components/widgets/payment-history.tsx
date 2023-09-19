import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { updatePayments } from "@/lib/update-payments"

export const PaymentHistory = () => {
  const payments = useStore(state => state.payments)

  const user = useStore(state => state.user)

  useEffect(() => {
    if (!user) return
    // Fetch payment history here and update the state
    updatePayments()
  }, [user]);

  const relativeTime = (createdAt: string) => {
    const currentTime = new Date();
    const createdAtDate = new Date(createdAt);
    const offset = currentTime.getTimezoneOffset() * 60000;

    const adjustedTime = new Date(createdAtDate.getTime() - offset);
    const timeDifference = currentTime.getTime() - adjustedTime.getTime();

    const diffSeconds = Math.floor(timeDifference / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
    return `${Math.floor(diffSeconds / 86400)}d`;
  };

  return (
    <Card className="flex flex-col max-h-[calc(100vh-280px)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col overflow-y-auto">
        <ul className="text-sm space-y-2">
          {payments.map((payment: any, index) => (
            <li key={index} className="flex justify-between">
              <span>Withdrew {payment.amount} sats</span>
              <span className="text-muted-foreground">{relativeTime(payment.createdAt)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
