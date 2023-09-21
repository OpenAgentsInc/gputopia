import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className={cn("tracking-wide text-white text-lg font-bold transition-colors hover:text-primary mr-4 p-1.5 flex flex-row items-center")} style={{ height: 60 }}>
        GPUTOPIA
      </Link>
      <Link
        href="/chat"
        className={cn("text-sm font-medium transition-colors hover:text-primary", {
          "text-white": isActive("/chat"),
          "text-muted-foreground": !isActive("/chat")
        })}
      >
        AI Chat
      </Link>
    </nav>
  )
}
