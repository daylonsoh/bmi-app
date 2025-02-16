"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBMI } from "@/lib/use-bmi"
import { useGameification } from "@/lib/use-gameification"

export function UserStats() {
  const { bmi } = useBMI()
  const { points, badges } = useGameification()
  const [kickstarterProgress, setKickstarterProgress] = useState(0)

  useEffect(() => {
    const progress = Math.min(points, 5)
    setKickstarterProgress((progress / 5) * 100)
  }, [points])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Current BMI: {bmi.toFixed(1)}</p>
          <p>Points: {points}</p>
          <div>
            <p>Kickstarter Badge Progress:</p>
            <Progress value={kickstarterProgress} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">{Math.min(points, 5)}/5 days</p>
          </div>
          <div>
            <p>Badges:</p>
            <ul className="list-disc list-inside">
              {badges.map((badge, index) => (
                <li key={index}>{badge}</li>
              ))}
              {!badges.includes("Kickstarter") && points >= 5 && <li className="text-green-500">Kickstarter (New!)</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

