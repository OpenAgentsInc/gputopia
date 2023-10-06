import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { initModel } from "@/lib/webllm"
import { withdraw } from "@/lib/withdraw"
import { AlbyUser } from "@/lib/useAlby"
import { useSearchParams } from "next/navigation"

export const Stats = () => {
  const onlineCount = useStore(state => state.onlineMembers)
  const totalSatsEarned = useStore(state => state.totalSatsEarned)
  const modelLoadPercentage = useStore(state => state.modelLoadPercentage)
  const balance = useStore(state => state.balance)
  const user = useStore(state => state.user) as AlbyUser

  const [modelLoading, setModelLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  
  const searchParams = useSearchParams()
  const debug = !!searchParams.get("debug")

  const userId = window.sessionStorage.getItem("user_id") as string

  const goWithdraw = async () => {
    if (balance === 0) {
      alert("You can't withdraw zero :(")
      return
    }
    setWithdrawLoading(true)
    await withdraw()
    setWithdrawLoading(false)
  }

  useEffect(() => {
    if (!user) return

    // document.addEventListener('model-loaded', function () {
    //   console.log('Model loaded');
    //   setModelLoaded(true)
    // });

    fetch("/api/balance", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).then((json) => {
      if (json.totalSatsEarned) {
        useStore.setState({ balance: json.balance, totalSatsEarned: json.totalSatsEarned })
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [user?.email])

  return (
    <div className="mx-8 my-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          {modelLoaded ? <div className="mt-3 flex flex-row items-center">
            <div className="loader"></div>
            <span className="pl-3 text-lg font-bold">Listening for jobs...</span>
          </div>
            : (
              <div className="h-12 flex items-center">
                {modelLoading ? (
                  <div className="w-full flex flex-row items-center">
                    <div id="perc" className="text-lg w-10 text-right font-mono"></div>
                    <Progress value={modelLoadPercentage} className="mx-4 w-[60%]" />
                  </div>
                ) :
                  <Button className="mt-1" onClick={() => {
                    setModelLoading(true)
                    initModel(user.lightning_address, userId, debug)
                  }}>Load model</Button>}
              </div>
            )}

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
            <div className="text-3xl font-bold">{balance}</div>
            <Button disabled={true} className="mt-1 w-42" onClick={goWithdraw}>
              Disabled until v3
            </Button>
            {/* <Button disabled={withdrawLoading || balance === 0} className="mt-1 w-42" onClick={goWithdraw}>
              {withdrawLoading ? "Withdrawing..." : "Withdraw to Alby"}
            </Button> */}
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
