import { useStore } from "@/lib/store"
import { PersonIcon } from "@radix-ui/react-icons"

export const OnlineUsers = () => {
  const onlineMembers = useStore((state) => state.onlineMembers)
  if (onlineMembers <= 0) return <></>
  return (
    <span className="flex flex-row items-center text-muted-foreground">
      <PersonIcon className="h-4 w-4 text-sm" />
      <p className="text-sm mx-1">{onlineMembers}</p>
    </span>
  )
}
