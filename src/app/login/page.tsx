"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconMessage, IconSidebar } from "@/components/ui/icons"
import { startAlbyOauth } from "@/lib/alby-oauth"

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

  const buttonStyles = selectedCard ? "opacity-100 cursor-pointer" : "opacity-25 cursor-not-allowed";

  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-screen-md px-4 sm:px-0">
      <div className="mt-36 mb-16  grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoginCard title="Chat" description="Interact with open language models in a conversational interface" selected={selectedCard === "Chat"} onSelect={handleCardSelect} />
        <LoginCard title="API" description="Integrate open models into your application or business" selected={selectedCard === "API"} onSelect={handleCardSelect} />
      </div>
      <button
        onClick={selectedCard ? startAlbyOauth : undefined}
        className={`tracking-wider font-medium big-green-button rounded-xl px-5 py-4 text-lg text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${buttonStyles}`}
        disabled={!selectedCard}
      >
        Log in with Alby
      </button>
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
