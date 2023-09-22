import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"
import { useStore } from "@/lib/store"
import { PersonIcon } from "@radix-ui/react-icons"

export const OnlineUsers = () => {
  const onlineMembers = useStore((state) => state.onlineMembers)
  if (onlineMembers <= 0) return <></>
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="flex flex-row items-center text-muted-foreground">
            <PersonIcon className="h-4 w-4 text-sm" />
            <p className="text-sm mx-1">{onlineMembers}</p>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Connected users</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
