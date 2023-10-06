"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconArrowRight, IconMessage, IconNextChat, IconSidebar
} from "@/components/ui/icons"

interface LoginCardProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: (title: string) => void;
}

export default function Login() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardSelect = (title: string) => {
    setSelectedCard(title);
  };

  return (
    <div className="mx-auto max-w-screen-md px-4 sm:px-0">
      <div className="m-24 grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoginCard title="Chat" description="Interact with open language models in a conversational interface" selected={selectedCard === "Chat"} onSelect={handleCardSelect} />
        <LoginCard title="API" description="Integrate open models into your application or business" selected={selectedCard === "API"} onSelect={handleCardSelect} />
      </div>
    </div>
  )
}

export function LoginCard({ title, description, selected, onSelect }: LoginCardProps) {
  const cardStyles = selected ? "bg-muted border-white" : ""; // Change these styles as per your preference
  const icon = title === "Chat" ? <IconMessage className="mt-1 ml-2 w-5 h-5" /> : <IconSidebar className="mt-1 ml-2 w-5 h-5" />

  return (
    <Card className={cardStyles} onClick={() => onSelect(title)}>
      <CardHeader>
        <CardTitle className="text-xl flex flex-row justify-between">{title} {icon}</CardTitle>
      </CardHeader>
      <CardContent className="-mt-2 text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
