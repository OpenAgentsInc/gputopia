import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Button } from "./ui/button"

export const Stats = () => {
  const onlineCount = useStore(state => state.onlineMembers)
  const totalSatsEarned = useStore(state => state.totalSatsEarned)

  useEffect(() => {
    fetch("/api/balance", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "chris@arcadelabs.co" }),
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((json) => {
      if (json.totalSatsEarned) {
        useStore.setState({ totalSatsEarned: json.totalSatsEarned })
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return (
    <div className="m-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">Model</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12M6 12h12" />
          </svg>
        </CardHeader>
        <CardContent>
          <Button className="mt-1">Load model</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
            Sats Balance
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-start justify-between">
            <div className="text-3xl font-bold">0</div>
            <Button className="mt-1">Withdraw</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
            Total Sats Earned
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>

        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalSatsEarned}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
            Connected Users
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{onlineCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}
