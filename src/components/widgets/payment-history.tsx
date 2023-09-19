import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"

export const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // Fetch payment history here and update the state
    fetch("/api/payment-history")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setPaymentHistory(data.payments);
      });
  }, []);

  const relativeTime = (createdAt) => {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-2">
          {paymentHistory.map((payment: any, index) => (
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
