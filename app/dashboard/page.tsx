import { BMITracker } from "@/components/bmi-tracker"
import { DailyQuote } from "@/components/daily-quote"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0 pt-1">
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full text-rose-400"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="16"
          >
            <path d="M384 0H96C60.65 0 32 28.65 32 64v384c0 35.35 28.65 64 64 64h288c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64zM96 480c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32h32v448H96z"/>
            <path d="M160 0h224c17.64 0 32 14.36 32 32v416c0 17.64-14.36 32-32 32H160V0z"/>
            <path d="M96 0h32v448H96c-17.64 0-32-14.36-32-32V64c0-17.64 14.36-32 32-32z" fill="#FFD54F"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Your BMI Journal</h1>
          <p className="text-gray-600">Track your BMI over time and get actionable recommendations to maintain optimal health. Try it for free.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyQuote />
        <BMITracker />
      </div>
    </div>
  )
}

