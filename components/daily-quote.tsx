"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The difference between try and triumph is just a little umph!",
  "Strive for progress, not perfection.",
  "The hardest lift of all is lifting your butt off the couch.",
  "The body achieves what the mind believes.",
  "You did not wake up today to be mediocre.",
  "If it doesn't challenge you, it doesn't change you.",
  "You can either suffer the pain of discipline or the pain of regret.",
  "We can push ourselves further. We always have more to give.",
  "Keep working even when no one is watching.",
  "Don't dream of winning. Train for it!",
  "Your mind will quit a thousand times before your body will.",
  "Set your goals high, and don't stop until you get there.",
  "Get comfortable with being uncomfortable!",
  "Making excuses burns zero calories per hour.",
  "Whether you think you can, or you think you can't, you are right.",
  "Success usually comes to those who are too busy to be looking for it.",
  "The groundwork for all happiness is good health.",
  "You are only as strong as your last workout.",
]

export function DailyQuote() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <Card className="col-span-2 bg-gradient-to-br from-amber-100 via-rose-100 to-violet-100 border-none shadow-lg overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-rose-400/10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      <CardHeader className="relative">
        <CardTitle className="text-amber-800 font-bold">Daily Motivation</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-lg italic text-rose-800 font-medium leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
    </Card>
  )
}

