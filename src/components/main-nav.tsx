import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const linkClasses = "text-sm font-medium transition-colors hover:text-primary"

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
        className={cn(linkClasses, {
          "text-white": isActive("/chat"),
          "text-muted-foreground": !isActive("/chat")
        })}
      >
        <span className="mx-2">AI Chat</span>
      </Link>
      <Link
        href="/intro"
        className={cn(linkClasses, {
          "text-white": isActive("/intro"),
          "text-muted-foreground": !isActive("/intro")
        })}
      >
        <span className="mx-2">Blog</span>
      </Link>
    </nav>
  )
}
