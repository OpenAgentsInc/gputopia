import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary -m-1.5 p-1.5 flex flex-row items-center"
        style={{ height: 60 }}
      >
        <Button variant="ghost">GPUtopia</Button>
      </Link>
    </nav>
  )
}
