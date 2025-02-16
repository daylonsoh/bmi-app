"use client"

import { useState, useEffect, useCallback } from "react"

interface BMIEntry {
  date: string
  bmi: number
}

export function useBMI() {
  const [bmi, setBMI] = useState<number | null>(null)
  const [bmiHistory, setBMIHistory] = useState<BMIEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedBMI = localStorage.getItem("bmi")
    const storedHistory = localStorage.getItem("bmiHistory")
    setBMI(storedBMI ? Number.parseFloat(storedBMI) : 0)
    if (storedHistory) setBMIHistory(JSON.parse(storedHistory))
    setIsLoaded(true)
  }, [])

  const updateBMI = useCallback((weight: number, height: number) => {
    const newBMI = weight / (height * height)
    setBMI(newBMI)
    const newEntry = { date: new Date().toISOString().split("T")[0], bmi: newBMI }
    setBMIHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newEntry]
      localStorage.setItem("bmiHistory", JSON.stringify(updatedHistory))
      return updatedHistory
    })
    localStorage.setItem("bmi", newBMI.toString())
  }, [])

  const exportDataAsTextFile = useCallback(() => {
    const data = bmiHistory.map((entry) => `${entry.date},${entry.bmi.toFixed(2)}`).join("\n")
    const blob = new Blob([data], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = "bmi_history.txt"
    link.href = url
    link.click()
  }, [bmiHistory])

  return { bmi: bmi ?? 0, bmiHistory, updateBMI, exportDataAsTextFile, isLoaded }
}

