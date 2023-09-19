import { utcToZonedTime } from "date-fns-tz"
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

    const timeDifference = currentTime.getTime() - createdAtDate.getTime();
    const diffSeconds = Math.floor(timeDifference / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
    return `${Math.floor(diffSeconds / 86400)}d`;
  };

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
