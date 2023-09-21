import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  console.log(pathname)

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-primary -m-1.5 p-1.5 flex flex-row items-center", {
        "text-white": isActive("/"),
        "text-muted-foreground": !isActive("/")
      })} style={{ height: 60 }}>
        GPUtopia
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
