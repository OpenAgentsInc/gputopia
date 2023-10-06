import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowRight } from "@/components/ui/icons"

interface LoginCardProps {
  title: string
  description: string
}

export default function Login() {
  return (
    <div className="mx-auto max-w-screen-md px-4 sm:px-0">
      <div className="m-24 grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoginCard title="Chat" description="Interact with open language models in a conversational interface" />
        <LoginCard title="API" description="Integrate open models into your application or business" />
      </div>
    </div>
  )
}

export function LoginCard({ title, description }: LoginCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex flex-row justify-between">{title} <IconArrowRight className="mt-1 ml-2 w-5 h-5" /></CardTitle>
      </CardHeader>
      <CardContent className="-mt-2 text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
