import Link from "next/link"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"
import { useBalance } from "@/lib/useBalance"
import { Button } from "./ui/button"

export const SatsBalance = () => {
  const balance = useBalance()
  return (
    <Link href="/balance">
      <Button variant="outline">
        <span className="flex flex-row items-center text-muted-foreground">
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
          <p className="text-sm text-left font-mono">{balance}</p>
        </span>
      </Button>
    </Link>
  )
}
