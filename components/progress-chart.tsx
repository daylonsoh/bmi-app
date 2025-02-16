"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBMI } from "@/lib/use-bmi"

interface BMIDataPoint {
  date: Date;
  bmi: number;
}

interface ProgressChartProps {
  bmiHistory: BMIDataPoint[];
}

export function ProgressChart({ bmiHistory: propsBmiHistory }: ProgressChartProps) {
  const { exportDataAsTextFile } = useBMI()
  const [chartData, setChartData] = useState<BMIDataPoint[]>(propsBmiHistory || [])

  useEffect(() => {
    setChartData(propsBmiHistory || [])
  }, [propsBmiHistory])

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const calculateTicks = (data: BMIDataPoint[]) => {
    if (!data.length) return []
    const bmiValues = data.map(d => d.bmi)
    const min = Math.min(...bmiValues)
    const max = Math.max(...bmiValues)
    return Array.from(
      { length: Math.ceil((max - min) * 2 + 2) },
      (_, i) => Math.floor(min * 2) / 2 + i * 0.5
    )
  }

  return (
    <Card className="bg-gradient-to-br from-violet-100 via-pink-100 to-cyan-100 border-none shadow-lg">
      <CardHeader className="text-violet-800">
        <CardTitle>BMI Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                interval="preserveStartEnd" 
                stroke="#7c3aed"
              />
              <YAxis 
                domain={["dataMin - 0.5", "dataMax + 0.5"]} 
                ticks={calculateTicks(chartData)}
                tickFormatter={(value) => value.toFixed(1)}
                stroke="#7c3aed"
              />
              <Tooltip 
                labelFormatter={formatDate} 
                formatter={(value: number) => [value.toFixed(1), "BMI"]}
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bmi" 
                stroke="url(#gradient)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#ec4899", stroke: "#ec4899" }} 
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-violet-700">No BMI data available. Calculate your BMI to see progress.</p>
        )}
        <div className="mt-4">
          <Button 
            onClick={exportDataAsTextFile} 
            disabled={!chartData?.length}
            className="bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 border-none text-white"
          >
            Download BMI History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

