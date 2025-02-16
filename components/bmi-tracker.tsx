"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBMI } from "@/lib/use-bmi"
import { useGameification } from "@/lib/use-gameification"
import BMIAnalysis from './bmi-analysis'
import { ProgressChart } from './progress-chart'

interface BMIDataPoint {
  date: Date;
  bmi: number;
}

export function BMITracker() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmiHistory, setBmiHistory] = useState<BMIDataPoint[]>([])
  const { bmi, updateBMI, isLoaded } = useBMI()
  const { incrementPoints } = useGameification()

  if (!isLoaded) {
    return null // or return a loading skeleton
  }

  const handleReset = () => {
    localStorage.removeItem("bmi")
    localStorage.removeItem("bmiHistory")
    updateBMI(0, 1)
    setBmiHistory([])
    window.location.reload()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const heightInMeters = Number.parseFloat(height) / 100
    const calculatedBMI = Number.parseFloat(weight) / (heightInMeters * heightInMeters)
    
    setBmiHistory(prev => [...prev, {
      date: new Date(),
      bmi: parseFloat(calculatedBMI.toFixed(1))
    }])
    
    updateBMI(Number.parseFloat(weight), heightInMeters)
    incrementPoints()
    setWeight("")
    setHeight("")
  }

  return (
    <Card className="col-span-full bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100 border-none shadow-lg">
      <CardHeader className="text-violet-800">
        <CardTitle>Today's BMI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="mb-4 text-violet-700 font-medium">Current BMI: {bmi === 0 ? "0" : bmi.toFixed(1)}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="height" className="text-violet-700">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height in cm"
                  required
                  className="bg-white/50 border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-violet-700">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight in kg"
                  required
                  className="bg-white/50 border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 border-none text-white">
                Calculate BMI
              </Button>
              {(bmi !== 0 || bmiHistory.length > 0) && (
                <Button 
                  type="button" 
                  onClick={handleReset}
                  variant="outline"
                  className="ml-2 text-gray-500 hover:text-gray-700 border-gray-300"
                >
                  Reset History
                </Button>
              )}
            </form>
          </div>
          <div className="bg-white/40 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2 text-violet-700">BMI Ranges</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-violet-600">
                  <th className="text-left">BMI</th>
                  <th className="text-left">Classification</th>
                </tr>
              </thead>
              <tbody className="text-violet-700">
                <tr>
                  <td>Below 18.5</td>
                  <td>Underweight</td>
                </tr>
                <tr>
                  <td>18.5 - 24.9</td>
                  <td>Normal weight</td>
                </tr>
                <tr>
                  <td>25.0 - 29.9</td>
                  <td>Overweight</td>
                </tr>
                <tr>
                  <td>30.0 and Above</td>
                  <td>Obese</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {bmiHistory.length > 0 && (
          <div className="mt-6">
            <ProgressChart bmiHistory={bmiHistory} />
            <BMIAnalysis bmiHistory={bmiHistory} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

