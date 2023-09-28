import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { updatePayments } from "@/lib/update-payments"

export const System = () => {

  return (
    <Card className="flex flex-col max-h-[calc(100vh-280px)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
          System Message
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col overflow-y-auto">
        <p className="mb-4 text-xl">v2 is done, v3 coming in a couple days</p>
        <p className="text-xl">See tweets <a href="https://twitter.com/GPUtopia/status/1704663450746523803" target="_blank" className="text-cyan-500">here</a> and <a href="https://twitter.com/GPUtopia/status/1704618436653981859" target="_blank" className="text-cyan-500">here</a></p>
      </CardContent>
    </Card>
  );
};
