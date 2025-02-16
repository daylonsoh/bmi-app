"use client"

import { useState, useEffect, useCallback } from "react"

export function useGameification() {
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    const storedPoints = localStorage.getItem("points")
    const storedBadges = localStorage.getItem("badges")
    if (storedPoints) setPoints(Number.parseInt(storedPoints))
    if (storedBadges) setBadges(JSON.parse(storedBadges))
  }, [])

  const incrementPoints = useCallback(() => {
    const newPoints = points + 1
    setPoints(newPoints)
    localStorage.setItem("points", newPoints.toString())

    if (newPoints >= 5 && !badges.includes("Kickstarter")) {
      const newBadges = [...badges, "Kickstarter"]
      setBadges(newBadges)
      localStorage.setItem("badges", JSON.stringify(newBadges))
    }
  }, [points, badges])

  return { points, badges, incrementPoints }
}

