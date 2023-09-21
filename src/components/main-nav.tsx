import Link from "next/link"
import { cn } from "@/lib/utils"

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
        {/* <img className=" h-auto w-12" src="/images/logo.png" alt="" /> */}
        <h1 className="ml-2 headline font-mono">GPUtopia</h1>
      </Link>
      {/*
      <a href="/" class="-m-1.5 p-1.5 flex flex-row items-center" style="height: 60px">
        <img class=" h-auto w-12" src="{{ asset('logo.png') }}" alt="">
        <h1 class="ml-2 headline">GPUTOPIA</h1>
      </a> */}

      {/* <Link
        href="/payments"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Payments
      </Link> */}
    </nav>
  )
}
