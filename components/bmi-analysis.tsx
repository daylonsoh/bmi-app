'use client';
import React, { useEffect, useState, useCallback } from 'react';

interface BMIDataPoint {
  date: Date;
  bmi: number;
}

interface BMIAnalysisProps {
  bmiHistory: BMIDataPoint[];
}

export default function BMIAnalysis({ bmiHistory }: BMIAnalysisProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState<'increasing' | 'decreasing' | 'stable' | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeBMITrend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentBMI = bmiHistory[bmiHistory.length - 1].bmi;
      const previousBMIs = bmiHistory.slice(-3);
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (previousBMIs.length >= 2) {
        const changes = previousBMIs.slice(1).map((point, i) => 
          point.bmi - previousBMIs[i].bmi
        );
        const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
        trend = avgChange > 0.1 ? 'increasing' : avgChange < -0.1 ? 'decreasing' : 'stable';
      }
      setTrend(trend);

      const response = await fetch('/api/bmi-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentBMI,
          trend
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      if (Array.isArray(data.tips) && data.tips.length > 0) {
        setTips(data.tips);
      } else {
        throw new Error('No tips received from the API');
      }
    } catch (error) {
      console.error('Failed to get BMI recommendations:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setTips([
        "Error getting personalized recommendations. Here are general tips:",
        "Maintain a balanced diet with proper portions",
        "Exercise regularly, aiming for 150 minutes per week",
        "Stay hydrated and get adequate sleep",
        "Consider consulting a healthcare professional",
      ]);
    } finally {
      setLoading(false);
    }
  }, [bmiHistory]);

  useEffect(() => {
    if (bmiHistory.length > 0) {
      analyzeBMITrend();
    }
  }, [bmiHistory, analyzeBMITrend]);

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'healthy';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  const currentBMI = bmiHistory[bmiHistory.length - 1]?.bmi;
  const bmiStatus = currentBMI ? getBMIStatus(currentBMI) : null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">BMI Analysis</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {currentBMI && (
        <div className="mb-4">
          <p>Current BMI: <span className="font-bold">{currentBMI}</span></p>
          <p>Status: <span className="font-bold capitalize">{bmiStatus}</span></p>
          {trend && (
            <p>Trend: <span className="font-bold capitalize">{trend}</span></p>
          )}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : (
        <div>
          <h4 className="font-bold mb-2">Recommended Actions:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            {tips.map((tip, index) => (
              <li 
                key={index} 
                className="text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: tip.replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold">$1</span>')
                }}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
} 