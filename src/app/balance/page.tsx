"use client"

import { useState } from "react"
import { BackgroundImage } from "@/components/background-image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ExternalLink, TypographyH1 as H1, TypographyH2 as H2, TypographyH3 as H3,
    TypographyP as P
} from "@/components/ui/typography"
import { PaymentHistory } from "@/components/widgets/payment-history"
import { useStore } from "@/lib/store"
import { useBalance } from "@/lib/useBalance"
import { withdraw, withdrawInvoice } from "@/lib/withdraw"

export default function Balance() {
  const balance = useBalance()
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const totalSatsEarned = useStore(state => state.totalSatsEarned)
  const goWithdraw = async () => {
    if (balance === 0) {
      alert("You can't withdraw zero :(")
      return
    }
    setWithdrawLoading(true)
    await withdraw()
    setWithdrawLoading(false)
  }
  const goWithdrawInvoice = async () => {
    if (balance === 0) {
      alert("You can't withdraw zero :(")
      return
    }
    setWithdrawLoading(true)
    await withdrawInvoice("lnbc90n1pjsu83tpp58p9aqqd4yae7g6evq5uusv3sulp7lv63y68jjw8ujefn57ykw04qdq5g9kxy7fqd9h8vmmfvdjscqzzsxqyz5vqsp5ynj48848e6mlpktqxt0hpgar99zdpwdz69qnpng9lrwdxx9q78cs9qyyssqvqfveprk02s4m7s4697k3vpcelsp45htnsgn2a4gdvncsvuhpaey6yf79xcz4dqyej28y4kwfe0u6yf50rue0yrpjnqznzm43k6xf0cpl62pee")
    setWithdrawLoading(false)
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col flex-grow justify-center">
        <BackgroundImage />

        <div className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-20 min-h-screen flex flex-col">
          <div className="mx-auto max-w-2xl p-4 sm:p-0">

            <Card className="bg-background w-96 mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex flex-row items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground mr-1"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Sats Balance
                </CardTitle>
                <div className="text-3xl font-bold">{balance}</div>
              </CardHeader>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-2 pb-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex flex-row items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground mr-1"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Total Sats Earned
                </CardTitle>
                <div className="text-3xl font-bold">{totalSatsEarned}</div>
              </CardHeader>

              <CardContent className="flex flex-col justify-center items-center">
                <Button
                  disabled={withdrawLoading || balance === 0}
                  className="mt-3 w-42" onClick={goWithdraw} variant="outline" size="lg">
                  {withdrawLoading ? "Withdrawing..." : "Withdraw to Alby"}
                </Button>

                <Button
                  disabled={withdrawLoading || balance === 0}
                  className="mt-3 w-42" onClick={goWithdrawInvoice} variant="outline" size="lg">
                  {withdrawLoading ? "Withdrawing..." : "Withdraw via invoice"}
                </Button>
              </CardContent>
            </Card>

            <PaymentHistory />

            {/* <Alert>
              <RocketIcon className="h-8 w-8" />
              <AlertTitle className="ml-4 text-lg">22 Sept Update</AlertTitle>
              <AlertDescription className="ml-4 text-muted-foreground">
                We are close to rolling out version 3 of our beta with the first buyer+seller experience. This page will be updated with details soon. You can prepare by creating your Alby account using the &apos;Log in with Alby&apos; button above.
              </AlertDescription>
            </Alert> */}

            {/* <H2 className="pt-4 my-8">Bitcoin balance</H2> */}

            {/* <P className="mt-12">
              <strong className="text-white text-lg text-center italic">Sats balance: {balance}</strong>
            </P> */}
          </div>
        </div>
      </div>
    </div>
  )
}
