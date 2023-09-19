import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const ChatWorkspace = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  // useEffect(() => {
  //   // Fetch payment history here and update the state
  //   fetch("/api/paymentHistory")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPaymentHistory(data);
  //     });
  // }, []);

  return (
    <div className="col-span-2" />
  );
};
